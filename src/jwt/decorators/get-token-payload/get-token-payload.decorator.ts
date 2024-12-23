import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetTokenPayload = createParamDecorator(
    (data: string | undefined, context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest()
      if (data) return request.data?.tokenPayload[data]
      return request.data?.tokenPayload
    },
  )
