import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    //Extract token from request
    const request = ctx.switchToHttp().getRequest();
    return request.token;
  },
);
