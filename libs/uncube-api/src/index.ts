import * as express from 'express';
import { UncubeApiModule } from './lib/api.module';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { FunctionBuilder } from 'firebase-functions';
import { ValidationPipe } from '@nestjs/common';

export * from './lib/index';

const expressServer = express();

const createFunction = async (
  expressInstance: express.Express
): Promise<void> => {
  process.env['NO_COLOR'] = 'true';
  const app = await NestFactory.create(
    UncubeApiModule,
    new ExpressAdapter(expressInstance),
    {
      cors: {
        origin: [
          'https://qubetime.codelog.co.za',
          'https://uncube.codelog.co.za',
          'http://localhost:4200',
        ],
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
      },
    }
  );

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validationError: { target: false, value: false },
    })
  );
  await app.init();
};

export const api = new FunctionBuilder({
  regions: ['europe-west2'],
}).https.onRequest(async (request, response) => {
  await createFunction(expressServer);
  expressServer(request, response);
});
