import { Injectable, ExecutionContext, Logger, UnauthorizedException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "./decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return true; // TODO: Remove this
    const handler = context.getHandler();
    const className = context.getClass().name;
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, context.getClass]);

    if (isPublic) {
      return true;
    } else {
      return super.canActivate(context);
    }
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error(`JWT is not Valid. Err: ${err}. - User ${user}. - Info. ${info}`);
      throw new UnauthorizedException("Unauthorized", String(HttpStatus.UNAUTHORIZED));
    }
    return user;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
