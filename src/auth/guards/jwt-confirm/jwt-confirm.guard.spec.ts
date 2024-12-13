import { JwtConfirmGuard } from './jwt-confirm.guard';

describe('JwtConfirmGuard', () => {
  it('should be defined', () => {
    expect(new JwtConfirmGuard()).toBeDefined();
  });
});
