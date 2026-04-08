import type { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { logger } from './common/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // En lugar de false, usa un objeto que mapee los métodos de Nest a Pino
    logger: {
      log: (msg) => logger.info(msg),
      error: (msg, trace) => logger.error({ msg, trace }),
      warn: (msg) => logger.warn(msg),
      debug: (msg) => logger.debug(msg),
      verbose: (msg) => logger.trace(msg),
    },
  });

  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    allowedHeaders: 'Content-Type, Accept', // Allow specific headers
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
  logger.info('Application is running on http://localhost:3000');
}

void bootstrap();
