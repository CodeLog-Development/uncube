import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request } from '../api.interface';
import { NextFunction, Response } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private logger = new Logger(AuthMiddleware.name);

  constructor(private userService: UserService) { }

  use(req: Request, _res: Response, next: NextFunction) {
    const cookie = req.cookies['uncube_session'];

    if (!cookie) {
      next();
    } else {
      this.userService
        .validateCookie(cookie)
        .then((user) => {
          if (user !== undefined) {
            req.user = user;
          }
        })
        .catch((e) => {
          this.logger.error('Failed to check user cookie', e);
        })
        .finally(() => next());
    }
  }
}
