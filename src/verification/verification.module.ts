import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule,
    UsersModule,
  ],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
