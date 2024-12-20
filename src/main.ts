import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { VALIDATOR_OPTIONS } from 'src/constants';
import { ConfigNames } from './config/interfaces/config.interface';
import { extractVersionValue } from './utils/string.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = new ConfigService();

  const PORT = config.get(ConfigNames.PORT) || 3000;
  const SERVER_VERSION = config.get(ConfigNames.VERSION) || '1';

  app.enableCors();

  app.setGlobalPrefix(`api/v${extractVersionValue(SERVER_VERSION)}`);
  app.useGlobalPipes(
    new ValidationPipe({
      ...VALIDATOR_OPTIONS,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Social Network API')
    .setDescription('The Social Network API description')
    .setVersion(SERVER_VERSION)
    .addBearerAuth({ type: 'http', scheme: 'bearer', }, 'Base Token')
    .addBearerAuth({ type: 'http', scheme: 'bearer', }, 'Access Token')
    .addBearerAuth({ type: 'http', scheme: 'bearer'}, 'Refresh Token')
    .addBearerAuth({ type: 'http', scheme: 'bearer'}, 'Confirmation Token')
    .addBearerAuth({ type: 'http', scheme: 'bearer'}, 'Reset Password Token')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/swagger', app, document);
  try {
    await app.listen(PORT, () => {
      console.log(`Running on Port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
  await app.getUrl().then((url) => {
    console.log(`Swagger Docs: ${url}/api/swagger`);
  });
}
bootstrap();
