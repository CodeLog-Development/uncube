import { Injectable } from '@nestjs/common';
import { FirebaseAppService } from './firebase-app.service';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class FirestoreService {
  constructor(private appService: FirebaseAppService) { }

  get firestore(): Firestore | undefined {
    return this.appService.app?.firestore();
  }
}
