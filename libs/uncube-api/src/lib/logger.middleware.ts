import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, _res: Response, next: NextFunction) {
    this.logger.log(
      `Request to ${req.method} ${req.path} from (${req.ip || 'Unknown IP'}).`
    );
    if (Object.keys(req.body).length > 0) {
      const body = req.body;
      const copy = JSON.parse(JSON.stringify(body));
      if (copy.password) {
        copy.password = '<redacted>';
      }
      this.logger.log('Request body: ', copy);
    }

    next();
  }
}
