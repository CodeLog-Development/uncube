import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Res,
} from '@nestjs/common';
import { FirestoreService } from '../firestore/firestore.service';
import { EmailConfirmationToken } from './dto/token.dto';
import { Response } from 'express';

@Controller('confirm')
export class ConfirmationController {
  private logger = new Logger(ConfirmationController.name);

  constructor(private firestoreService: FirestoreService) { }

  @Get(':token')
  async confirmEmail(@Param('token') token: string, @Res() res: Response) {
    const tokens = await this.firestoreService.firestore
      ?.collection('/confirmationTokens')
      .where('token', '==', token)
      .get();

    if (tokens === undefined || tokens.docs.length === 0) {
      throw new BadRequestException('No such token exists');
    }

    const tokenObj = tokens.docs[0].data() as EmailConfirmationToken;
    try {
      await tokenObj.user.update({ emailVerified: true });
      res
        .status(200)
        .type('html')
        .send(
          `
          <!DOCTYPE html>
          <html>
            <body><p>Email confirmed. You may now <a href="https://uncube.codelog.co.za/">log in</a></p></body>
          </html>
        `
        )
        .end();
    } catch (e) {
      this.logger.error('Failed to update user email verification status', e);
      throw new InternalServerErrorException(
        'Failed to update email verification status, please try again later'
      );
    }
  }
}
