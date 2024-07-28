import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = new ConfigService();

  const PORT = config.get('PORT') || 3000;
  const SERVER_VERSION = config.get('SERVER_VERSION') || '1.0';

  app.setGlobalPrefix(`api/v${parseInt(SERVER_VERSION)}`);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Social Network API')
    .setDescription('The Social Network API description')
    .setVersion(SERVER_VERSION)
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
}
bootstrap();
