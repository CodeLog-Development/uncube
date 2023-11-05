import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from './dto/auth.dto';
import { Response } from 'express';
import { FirestoreService } from '../firestore/firestore.service';
import { User } from '../user';
import { DocumentReference } from 'firebase-admin/firestore';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) { }

  @Post()
  async login(
    @Body() authRequest: AuthRequest,
    @Res() res: Response
  ): Promise<void> {
    const result = await this.authService.validateCredentials(
      authRequest.email,
      authRequest.password
    );

    if (!result) {
      throw new BadRequestException('Incorrect email or password');
    }

    const user = await this.firestoreService.firestore
      ?.collection('/users')
      .where('email', '==', authRequest.email)
      .limit(1)
      .get();

    if (user === undefined || user.docs.length < 1) {
      throw new InternalServerErrorException(
        'Failed to retrieve user from database'
      );
    }

    const cookie = await this.authService.generateCookie(
      user.docs[0].ref as DocumentReference<User>
    );

    res.cookie('alan_backend', cookie, {
      secure: true,
      sameSite: 'strict',
      expires: cookie.expires.toDate(),
      httpOnly: true,
      path: '/',
    });
    res.status(200);
  }
}
