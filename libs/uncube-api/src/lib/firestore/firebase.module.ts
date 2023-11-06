import { Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { FirebaseAppService } from './firebase-app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [FirestoreService, FirebaseAppService],
  exports: [FirestoreService],
})
export class FirebaseModule {}
