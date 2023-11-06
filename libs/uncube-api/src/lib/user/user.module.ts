import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FirebaseModule } from '../firestore/firebase.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [FirebaseModule],
  exports: [UserService],
})
export class UserModule {}
