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
import { JwtRefreshStrategy } from './auth/strategies/jwt-refresh/jwt-refresh.strategy';
import { JwtConfirmStrategy } from './auth/strategies/jwt-confirm/jwt-confirm.strategy';
import { JwtAccessStrategy } from './auth/strategies/jwt-access/jwt-access.strategy';
import { JwtModule } from './jwt/jwt.module';
import { MediaModule } from './media/media.module';
import { PostModule } from './post/post.module';
import { MessageModule } from './message/message.module';
import { CommentModule } from './comment/comment.module';
import { NotificationModule } from './notification/notification.module';
import { ReactionModule } from './reaction/reaction.module';

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
    JwtModule,
    MediaModule,
    PostModule,
    MessageModule,
    CommentModule,
    NotificationModule,
    ReactionModule
  ],
  controllers: [AppController],
  providers: [AppService, VerifyEmailGuard, RolesGuard,  JwtAccessStrategy, JwtConfirmStrategy, JwtRefreshStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenBlacklistMiddleware).forRoutes('*');
  }
}
