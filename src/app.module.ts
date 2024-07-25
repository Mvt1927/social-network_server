import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestGateway } from './test/test.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TestGateway],
})
export class AppModule {}
