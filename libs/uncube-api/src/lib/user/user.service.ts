import { Injectable, Logger } from '@nestjs/common';
import { User } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FirestoreService } from '../firestore/firestore.service';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(private firestoreService: FirestoreService) {}

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
      await firestore.collection('/users').add(newUser);
    } catch (e) {
      this.logger.error('Failed to create new user');
      return undefined;
    }

    return newUser;
  }

  async findUser(
    fieldPath: string,
    op: FirebaseFirestore.WhereFilterOp,
    username: string
  ): Promise<User | undefined> {
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

    const user = docs[0];
    const data = user.data();
    return data as User;
  }
}
