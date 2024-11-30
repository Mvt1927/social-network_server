import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { config } from './config';
import { validationSchema } from './config/config.schema';
import { TokenBlacklistModule } from './blacklist/token-blacklist/token-blacklist.module';
import { TokenBlacklistMiddleware } from './blacklist/token-blacklist/token-blacklist.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      load: [config],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    TokenBlacklistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenBlacklistMiddleware).forRoutes('*');
  }
}
