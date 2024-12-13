import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtConfirmGuard extends AuthGuard('jwt-confirm') {
  constructor() {
    super({
      property: 'data',
    });
  }

  handleRequest<TUser = any>(
    err: any,
    payload: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err) {
      throw err;
    }

    if (!payload) {
      const { name, message, ...rest } = info;

      const messagePayload = {
        name: name,
        message: message,
        ...rest,
      };

      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: messagePayload,
      });
    }

    const data = {
      user: payload.user,
      tokenPayload: payload.tokenPayload,
      token: ExtractJwt.fromAuthHeaderAsBearerToken()(
        context.switchToHttp().getRequest(),
      ),
      ...context.switchToHttp().getRequest().data,
    };

    return data;
  }
}
