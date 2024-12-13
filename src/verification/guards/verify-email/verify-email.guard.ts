import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserWithoutHiddenAttributes } from 'src/users/types';

@Injectable()
export class VerifyEmailGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { data } = context.switchToHttp().getRequest();
    const user: UserWithoutHiddenAttributes = data?.user;

    if (!user) {
      return false;
    }
    
    if (!user.isVerified) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.FORBIDDEN,
        messgae: 'Email is not verified',
      });
    }

    return user.isVerified;
  }
}
