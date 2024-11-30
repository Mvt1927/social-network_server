import {
  ExecutionContext,
  HttpCode,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
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

    console.log('data', data);

    return data;
  }
}
