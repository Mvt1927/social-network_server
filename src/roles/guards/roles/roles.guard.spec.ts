import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RoleGuard', () => {
  it('should be defined', () => {
    const reflector = {} as Reflector; // Mock or create an instance of Reflector
    expect(new RolesGuard(reflector)).toBeDefined();
  });
});
