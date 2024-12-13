import { Module } from '@nestjs/common';
import { TokenBlacklistService } from './token-blacklist.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  // imports: [CacheModule],
  providers: [TokenBlacklistService],
  exports: [TokenBlacklistService],
})
export class TokenBlacklistModule {}
