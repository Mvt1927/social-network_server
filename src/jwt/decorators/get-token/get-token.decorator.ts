import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

export const GetToken = createParamDecorator((data: string | undefined, context: ExecutionContext) => {
    return ExtractJwt.fromAuthHeaderAsBearerToken()(context.switchToHttp().getRequest());   
});
