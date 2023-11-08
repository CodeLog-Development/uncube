import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { FirebaseModule } from '../firestore/firebase.module';
import { SolveController } from './solve.controller';
import { SolveService } from './solve.service';

@Module({
  controllers: [SolveController],
  imports: [UserModule, FirebaseModule],
  providers: [SolveService],
  exports: [SolveService],
})
export class SolveModule { }
