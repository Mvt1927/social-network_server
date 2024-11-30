import { TokenBlacklistMiddleware } from './token-blacklist.middleware';
import { TokenBlacklistService } from './token-blacklist.service';

describe('TokenBlacklistMiddleware', () => {
  it('should be defined', () => {
    const tokenBlacklistService = {} as TokenBlacklistService; // Mock or create an instance of TokenBlacklistService
    expect(new TokenBlacklistMiddleware(tokenBlacklistService)).toBeDefined();
  });
});
