import { Injectable, ExecutionContext, Logger, UnauthorizedException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { IS_PUBLIC_KEY } from "./decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
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
    if (err) {
      // auth flow error, log as error
      this.logger.error(`JWT auth error. Err: ${err}. - Info. ${info}`);
      throw new UnauthorizedException("Unauthorized", String(HttpStatus.UNAUTHORIZED));
    }
    if (!user) {
      if (info instanceof TokenExpiredError) {
        // Expected expiration
        this.logger.log(`JWT expired at ${info.expiredAt}.`);
      } else if (info instanceof JsonWebTokenError && info.message === "invalid signature") {
        // well-formed token but signature failed, possible tampering
        this.logger.warn(`JWT signature invalid - possible tampering. Info. ${info.message}`);
      } else if (info instanceof JsonWebTokenError) {
        // Malformed but not unusual
        this.logger.log(`JWT is not Valid. Info. ${info.message}`);
      } else {
        // No token presented, or a non-Error info value
        this.logger.log(`JWT is not Valid. Info. ${info?.message ?? info}`);
      }
      throw new UnauthorizedException("Unauthorized", String(HttpStatus.UNAUTHORIZED));
    }
    return user;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
