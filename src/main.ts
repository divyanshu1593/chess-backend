import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Environments } from 'src/common/enums/environments.enum';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean | string) => void,
    ) => {
      const allowedOrigins = configService
        .get<string>('ALLOWED_ORIGIN')
        ?.split(',');

      if (
        configService.get<string>('ENVIRONMENT') === Environments.PRODUCTION
      ) {
        if (!allowedOrigins) {
          callback(
            new InternalServerErrorException(
              ErrorMessages.ALLOWED_ORIGIN_NOT_CONFIGURED,
            ),
          );
        } else if (origin && !allowedOrigins.includes(origin)) {
          callback(new BadRequestException(ErrorMessages.ORIGIN_NOT_ALLOWED));
        }
      } else {
        callback(null, true);
      }
    },
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Chess Backend')
    .setDescription('This is swagger for chess backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
