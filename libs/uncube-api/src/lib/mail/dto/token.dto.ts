import { DocumentReference } from 'firebase-admin/firestore';
import { User } from '../../user';

export interface EmailConfirmationToken {
  user: DocumentReference<User>;
  token: string;
}
