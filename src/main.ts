import * as basicAuth from 'express-basic-auth';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const { SWAGGER_ADMIN_NAME, SWAGGER_ADMIN_PASSWORD, PORT } = process.env;

  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [SWAGGER_ADMIN_NAME ?? 'admin']: SWAGGER_ADMIN_PASSWORD ?? 'password',
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ITMO.ID Auth Service')
    .setDescription('Сервис авторизации через ITMO.ID')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT ?? 4000);
}

bootstrap();
