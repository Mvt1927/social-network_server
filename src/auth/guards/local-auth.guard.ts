import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { SignInAuthWithUsernameDto } from '../dto';
import { validate } from 'class-validator';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    // transform the request object to class instance
    const body = plainToClass(SignInAuthWithUsernameDto, request.body);

    // get a list of errors
    const errors = await validate(body);

    // extract error messages from the errors array
    const errorMessages = errors.flatMap(({ constraints }) =>
      Object.values(constraints),
    );

    if (errorMessages.length > 0) {
      // return bad request if validation failspr
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: errorMessages,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
