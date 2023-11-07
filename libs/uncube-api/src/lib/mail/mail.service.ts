import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `https://europe-west2-qubetime.cloudfunctions.net/api/confirm/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to UnCube. Please confirm your email',
      template: './confirmation',
      context: {
        name: user.username,
        url,
      },
    });
  }
}
