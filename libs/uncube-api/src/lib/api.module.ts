import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './logger.middleware';
import { FirebaseModule } from './firestore/firebase.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    FirebaseModule,
    UserModule,
    AuthModule,
    MailModule,
  ],
})
export class UncubeApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
