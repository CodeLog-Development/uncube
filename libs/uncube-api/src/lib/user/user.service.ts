import { Injectable, Logger } from '@nestjs/common';
import { User } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FirestoreService } from '../firestore/firestore.service';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { DocumentReference, Timestamp } from 'firebase-admin/firestore';
import { EmailConfirmationToken } from '../mail/dto/token.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    private firestoreService: FirestoreService,
    private mailService: MailService
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User | undefined> {
    const passwordHash = await argon2.hash(createUserDto.password);
    const firestore = this.firestoreService.firestore;
    if (!firestore) {
      this.logger.fatal('There is no available database');
      return undefined;
    }

    const newUser: User = {
      username: createUserDto.username,
      email: createUserDto.email,
      emailVerified: false,
      passwordHash,
    };

    try {
      const confirmationToken = crypto.randomBytes(16).toString('hex');
      const userRef = (await firestore
        .collection('/users')
        .add(newUser)) as DocumentReference<User>;
      const user = (await userRef.get()).data() as User;

      const newToken: EmailConfirmationToken = {
        user: userRef,
        token: confirmationToken,
      };
      await firestore.collection('/confirmationTokens').add(newToken);
      await this.mailService.sendUserConfirmation(user, newToken.token);
    } catch (e) {
      this.logger.error('Failed to create new user', e);
      return undefined;
    }

    return newUser;
  }

  async findUserRef(
    fieldPath: string,
    op: FirebaseFirestore.WhereFilterOp,
    username: string
  ): Promise<DocumentReference<User> | undefined> {
    const firestore = this.firestoreService.firestore;
    if (!firestore) {
      this.logger.fatal('There is no available database');
      return undefined;
    }

    const result = await firestore
      .collection('/users')
      .where(fieldPath, op, username)
      .limit(1)
      .get();

    const docs = result.docs;
    if (docs.length !== 1) {
      return undefined;
    }

    return docs[0].ref as DocumentReference<User>;
  }

  async findUser(
    fieldPath: string,
    op: FirebaseFirestore.WhereFilterOp,
    username: string
  ): Promise<User | undefined> {
    const result = await this.findUserRef(fieldPath, op, username);
    return (await result?.get())?.data() as User | undefined;
  }

  async validateCookie(secret: string): Promise<User | undefined> {
    const firestore = this.firestoreService.firestore;
    const cookies = await firestore
      ?.collection('/cookies')
      .where('secret', '==', secret)
      .where('expires', '>=', Timestamp.fromMillis(Date.now()))
      .limit(1)
      .get();

    if (cookies?.docs.length !== 1) {
      return undefined;
    }

    const user: DocumentReference<User> = cookies.docs[0].data()['user'];
    return (await user.get()).data();
  }
}
