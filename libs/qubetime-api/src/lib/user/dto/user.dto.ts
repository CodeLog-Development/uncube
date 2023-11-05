import { Exclude } from 'class-transformer';

export class User {
  username: string;
  email: string;
  emailVerified: boolean;

  @Exclude()
  passwordHash: string;
}
