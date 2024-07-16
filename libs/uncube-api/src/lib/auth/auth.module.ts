import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseModule } from '../firestore/firebase.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  imports: [FirebaseModule, UserModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
