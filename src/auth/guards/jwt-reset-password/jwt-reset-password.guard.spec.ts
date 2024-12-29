import { JwtResetPasswordGuard } from './jwt-reset-password.guard';

describe('JwtResetPasswordGuard', () => {
  it('should be defined', () => {
    expect(new JwtResetPasswordGuard()).toBeDefined();
  });
});
