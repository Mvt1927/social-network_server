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
import { VerificationModule } from './verification/verification.module';
import { EmailModule } from './email/email.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { VerifyEmailGuard } from './verification/guards/verify-email/verify-email.guard';
import { RolesGuard } from './roles/guards/roles/roles.guard';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 3 * 60000, // 3 minutes (milliseconds)
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      load: [config],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    TokenBlacklistModule,
    VerificationModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, VerifyEmailGuard, RolesGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenBlacklistMiddleware).forRoutes('*');
  }
}
