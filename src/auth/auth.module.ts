import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from 'src/jwt/jwt.module';
import { JwtAccessStrategy } from './strategies/jwt-access/jwt-access.strategy';
import { TokenBlacklistModule } from 'src/blacklist/token-blacklist/token-blacklist.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule,
    TokenBlacklistModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy],
})
export class AuthModule {}
