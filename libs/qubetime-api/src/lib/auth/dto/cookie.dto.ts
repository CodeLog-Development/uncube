import { DocumentReference, Timestamp } from 'firebase-admin/firestore';
import { User } from '../../user';

export class Cookie {
  secret: string;
  expires: Timestamp;
  user: DocumentReference<User>;
}
