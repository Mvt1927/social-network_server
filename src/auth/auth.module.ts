import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
