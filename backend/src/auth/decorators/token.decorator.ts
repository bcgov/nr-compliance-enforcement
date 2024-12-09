import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Token = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  //Extract token from request
  const request = ctx.switchToHttp().getRequest();
  if (request.token) {
    return request.token;
  }
  // If the token is not directly accessible in the request object, take it from the headers
  let token = request.headers.authorization;
  if (token && token.indexOf("Bearer ") === 0) {
    token = token.substring(7);
  }
  return token;
});
