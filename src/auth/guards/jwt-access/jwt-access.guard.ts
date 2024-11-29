import {
  ExecutionContext,
  HttpCode,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
  constructor() {
    super();
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
      }

      throw (
        new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: messagePayload,
        })
      );
    }

    return payload;
  }
}
