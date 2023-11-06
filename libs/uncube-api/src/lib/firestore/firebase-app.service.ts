import { Injectable, Logger, OnModuleInit, Scope } from '@nestjs/common';
import { ServiceAccount, app, credential, initializeApp } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.DEFAULT })
export class FirebaseAppService implements OnModuleInit {
  private appRef?: app.App;
  private logger = new Logger(FirebaseAppService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const serviceAccount =
      this.configService.get<ServiceAccount>('serviceAccount');

    if (!serviceAccount) {
      throw 'Failed to load firebase service account credentials';
    }

    if (!this.appRef) {
      try {
        this.appRef = initializeApp({
          credential: credential.cert(serviceAccount),
        });
      } catch (e) {
        this.logger.warn(
          "We couldn't initialize firebase, this is pretty bad, but we're ignoring it for now.",
          e
        );
      }
    }
  }

  get app(): app.App | undefined {
    return this.appRef;
  }
}
