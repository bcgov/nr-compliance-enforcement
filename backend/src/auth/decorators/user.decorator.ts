import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// Returns the user off of the request object.
// Sample usage: foo(@User() user) {...}
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
