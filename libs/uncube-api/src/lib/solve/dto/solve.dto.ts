import { DocumentReference, Timestamp } from 'firebase-admin/firestore';
import { User } from '../../user';
import { Exclude } from 'class-transformer';

export class DbSolve {
  id: string;
  millis: number;
  timestamp: Timestamp;
  penalty?: '+2' | 'dnf';
  scramble?: string;

  @Exclude()
  owner: DocumentReference<User>;

  constructor(partial: Partial<DbSolve>) {
    Object.assign(this, partial);
  }
}

export interface Solve {
  id: string;
  millis: number;
  timestamp: number;
  penalty?: '+2' | 'dnf';
  scramble?: string;
}

export interface SolveList {
  solves: Solve[];
}
