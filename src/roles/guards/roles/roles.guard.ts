import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/roles/decorators/roles/roles.decorator';
import { UserWithoutHiddenAttributes } from 'src/users/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { data } = context.switchToHttp().getRequest();

    const user: UserWithoutHiddenAttributes = data?.user;

    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
