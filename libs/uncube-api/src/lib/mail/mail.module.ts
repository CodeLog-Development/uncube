import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseModule } from '../firestore/firebase.module';
import { ConfirmationController } from './confirmation.controller';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('mailConfig').host,
          secure: true,
          auth: {
            user: config.get('mailConfig').user,
            pass: config.get('mailConfig').password,
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('mailConfig').from}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    FirebaseModule,
  ],
  controllers: [ConfirmationController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}