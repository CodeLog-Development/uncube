import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSolveDto } from './dto/create-solve.dto';
import { User } from '../user';
import { FirestoreService } from '../firestore/firestore.service';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto';
import { Solve } from './dto/solve.dto';
import { Timestamp } from 'firebase-admin/firestore';

@Injectable()
export class SolveService {
  constructor(
    private firestoreService: FirestoreService,
    private userService: UserService
  ) { }

  async createSolve(newSolve: CreateSolveDto, owner: User): Promise<Solve> {
    if (newSolve.timestamp > Date.now()) {
      throw new BadRequestException(
        'Creation timestamp cannot be in the future!'
      );
    }

    const firestore = this.firestoreService.firestore;
    const userRef = await this.userService.findUserRef(
      'email',
      '==',
      owner.email
    );

    if (userRef === undefined) {
      throw new InternalServerErrorException(
        'Failed to find user associated with session'
      );
    }

    const solve: Solve = {
      ...newSolve,
      timestamp: Timestamp.fromMillis(newSolve.timestamp),
      id: crypto.randomBytes(8).toString('hex'),
      owner: userRef,
    };

    try {
      await firestore?.collection('/solves').add(solve);
      return solve;
    } catch (e) {
      throw new InternalServerErrorException('Failed to add solve to database');
    }
  }
}
