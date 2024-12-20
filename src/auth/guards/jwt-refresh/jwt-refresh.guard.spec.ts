import { JwtRefreshGuard } from './jwt-refresh.guard';

describe('JwtAccessGuard', () => {
  it('should be defined', () => {
    expect(new JwtRefreshGuard()).toBeDefined();
  });
});
