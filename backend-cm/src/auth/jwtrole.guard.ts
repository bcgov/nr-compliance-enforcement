import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
  Logger,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "../enum/role.enum";
import { ROLES_KEY } from "./decorators/roles.decorator";
import { GqlExecutionContext } from "@nestjs/graphql";
import { IS_PUBLIC_KEY } from "./decorators/public.decorator";

@Injectable()
/**
 * An API guard used to authorize controller methods.  This guard checks for othe @Roles decorator, and compares it against the role_names of the authenticated user's jwt.
 * Requires the @JwtRoleGuard to be applied against the class, even if the @Role is used at the method levels
 */
export class JwtRoleGuard extends AuthGuard("jwt") implements CanActivate {
  private readonly logger = new Logger(JwtRoleGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  // returns false if the user does not have the required role indicated by the API's @Roles decorator
  canActivate(context: ExecutionContext): boolean {
    //-- check to see if the public access decorator is used
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);

    // get the roles associated with the request
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.debug(`Guarded Roles: ${requiredRoles}`);

    const request = ctx.getContext().req;

    const user = request.user;

    if (!user) {
      this.logger.error("User authorization not verified");
      throw new UnauthorizedException("Cannot verify user authorization");
    }

    const userRoles: string[] = user.client_roles;
    // Check if the user has the readonly role
    const hasReadOnlyRole = userRoles.includes(Role.READ_ONLY);

    // If the user has readonly role, allow only GET requests
    if (hasReadOnlyRole) {
      if (request.method !== "GET") {
        this.logger.debug(`User with readonly role attempted ${request.method} method`);
        throw new ForbiddenException("Access denied: Read-only users cannot perform this action");
      }
    }

    // if there aren't any required roles, don't allow the user to access any api.  Unless the API is marked as public, at least one role is required.
    if (!requiredRoles) {
      this.logger.error(
        `Endpoint ${request.originalUrl} is not properly guarded.  Endpoint needs to either be marked as public, or at least one role is required.`,
      );
      return false;
    }

    this.logger.debug(`User Roles: ${userRoles}`);

    // does the user have a required role?
    return requiredRoles.some((role) => userRoles?.includes(role));
  }
}
