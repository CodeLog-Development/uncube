import { Exclude } from 'class-transformer';

export class User {
  username: string;
  email: string;
  emailVerified: boolean;

  @Exclude()
  passwordHash: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
