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
import { DbSolve } from './dto/solve.dto';
import { FieldValue, Firestore, Timestamp } from 'firebase-admin/firestore';
import { UpdateSolveDto } from './dto';

@Injectable()
export class SolveService {
  constructor(
    private firestoreService: FirestoreService,
    private userService: UserService
  ) { }

  async createSolve(newSolve: CreateSolveDto, owner: User): Promise<DbSolve> {
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

    const solve: DbSolve = {
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

  async getSolves(owner: User): Promise<DbSolve[]> {
    const firestore = this.firestoreService.firestore;
    const userRef = await this.userService.findUserRef(
      'email',
      '==',
      owner.email
    );

    if (userRef === undefined) {
      throw new InternalServerErrorException('Failed to find user');
    }

    const queryResult = await firestore
      ?.collection('/solves')
      .where('owner', '==', userRef)
      .get();

    return queryResult?.docs.map((doc) => doc.data() as DbSolve) || [];
  }

  async deleteSolve(id: string, user: User) {
    const firestore = this.firestoreService.firestore;
    const userRef = await this.userService.findUserRef(
      'email',
      '==',
      user.email
    );

    if (userRef === undefined) {
      throw new InternalServerErrorException('Failed to find user');
    }

    const solveRef = (
      await firestore
        ?.collection('/solves')
        .where('id', '==', id)
        .limit(1)
        .get()
    )?.docs[0];

    const solveData = solveRef?.data() as DbSolve;
    if (!solveRef || !solveData) {
      throw new BadRequestException('No such solve');
    }

    if (!solveData.owner.isEqual(userRef)) {
      throw new BadRequestException(
        'User is not the owner of solve to be deleted'
      );
    }

    await solveRef.ref.delete();
  }

  async update(id: string, updateSolve: UpdateSolveDto, owner: User) {
    const firestore = this.firestoreService.firestore;
    const userRef = await this.userService.findUserRef(
      'email',
      '==',
      owner.email
    );

    if (userRef === undefined) {
      throw new InternalServerErrorException('Failed to find user');
    }

    const solveDoc = (
      await firestore
        ?.collection('/solves')
        .where('id', '==', id)
        .limit(1)
        .get()
    )?.docs[0];

    const solveData = solveDoc?.data() as DbSolve;
    if (!solveDoc || !solveData) {
      throw new BadRequestException('No such solve');
    }

    if (!solveData.owner.isEqual(userRef)) {
      throw new BadRequestException(
        'User is not the owner of solve to be updated'
      );
    }

    const update = {
      penalty: updateSolve.penalty || FieldValue.delete(),
    };

    await solveDoc.ref.update(update);
  }
}
