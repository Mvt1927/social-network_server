import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class TokenBlacklistService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  async addTokenToBlacklist(token: string, expiresIn: number): Promise<void> {
    await this.cacheManager.set(token, 'blacklisted', expiresIn);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.cacheManager.get(token);
    return result === 'blacklisted';
  }
}
