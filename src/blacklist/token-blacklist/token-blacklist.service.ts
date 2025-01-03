import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class TokenBlacklistService {

  public TOKEN_BLACKLIST = 'TOKEN_BLACKLIST';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  async addTokenToBlacklist(token: string, expiresIn: number): Promise<void> {
    await this.cacheManager.set(`${this.TOKEN_BLACKLIST}:${token}`, 'blacklisted', expiresIn);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.cacheManager.get(`${this.TOKEN_BLACKLIST}:${token}`);
    return result === 'blacklisted';
  }
}
