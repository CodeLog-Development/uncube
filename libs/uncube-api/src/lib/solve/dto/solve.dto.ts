import { DocumentReference, Timestamp } from 'firebase-admin/firestore';
import { User } from '../../user';
import { Exclude } from 'class-transformer';

export class Solve {
  id: string;
  millis: number;
  timestamp: Timestamp;
  penalty?: '+2' | 'dnf';

  @Exclude()
  owner: DocumentReference<User>;

  constructor(partial: Partial<Solve>) {
    Object.assign(this, partial);
  }
}
