import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DocumentReference, Timestamp } from 'firebase-admin/firestore';
import { User } from '../user';
import { FirestoreService } from '../firestore/firestore.service';
import { Cookie } from './dto/cookie.dto';
import * as crypto from 'crypto';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private firestoreService: FirestoreService,
    private userService: UserService
  ) {}

  async validateCredentials(email: string, password: string): Promise<boolean> {
    const firestore = this.firestoreService.firestore;
    if (firestore === undefined) {
      this.logger.fatal('No database connection is present');
      throw new InternalServerErrorException();
    }

    const user = await this.userService.findUser('email', '==', email);
    if (user === undefined) {
      return false;
    }

    return await argon2.verify(user.passwordHash, password);
  }

  /**
   * Generates a cookie for a given user. This function inserts the cookie
   * into the database and returns the secret as a string.
   *
   * @returns The cookie secret represented as a string.
   *
   * @throws InternalServerErrorException if no database is present
   */
  async generateCookie(user: DocumentReference<User>): Promise<Cookie> {
    const firestore = this.firestoreService.firestore;
    if (firestore === undefined) {
      this.logger.fatal('No database connection is present');
      throw new InternalServerErrorException();
    }

    const newCookie: Cookie = {
      secret: crypto.randomBytes(16).toString('hex'),
      expires: Timestamp.fromMillis(Date.now() + 1000 * 60 * 60 * 24 * 3),
      user,
    };

    try {
      await firestore.collection('/cookies').add(newCookie);
      return newCookie;
    } catch (e) {
      this.logger.error('Failed to add cookie to database', e);
      throw new InternalServerErrorException();
    }
  }
}
