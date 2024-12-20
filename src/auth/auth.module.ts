import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from 'src/jwt/jwt.module';
import { JwtAccessStrategy } from './strategies/jwt-access/jwt-access.strategy';
import { TokenBlacklistModule } from 'src/blacklist/token-blacklist/token-blacklist.module';
import { VerificationModule } from 'src/verification/verification.module';
import { EmailModule } from 'src/email/email.module';
import { JwtConfirmStrategy } from './strategies/jwt-confirm/jwt-confirm.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule,
    TokenBlacklistModule,
    VerificationModule,
    EmailModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
