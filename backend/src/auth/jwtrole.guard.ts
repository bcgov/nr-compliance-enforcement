import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/enum/role.enum';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
/**
 * A route guard used to authorize controller methods.  This guard checks for othe @Roles decorator, and compares it against the role_names of the authenticated user's jwt.
 */
export class JwtRoleGuard extends AuthGuard('jwt') implements CanActivate {

  private readonly logger = new Logger(JwtRoleGuard.name);

  constructor(private reflector: Reflector) {
    super();
  } 
  
  canActivate(context: ExecutionContext): boolean {

    // get the roles associated with the request
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);      

    this.logger.debug(`Guarded Roles: ${requiredRoles}`);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        'Cannot verify user authorization',
      );
    }

    // if there aren't any required roles, don't allow the user to access any api.  Unless the API is marked as public, at least one role is required.
    if (!requiredRoles) {
      this.logger.error(`Endpoint ${request.originalUrl} is not properly guarded.  Endpoint needs to either be marked as public, or at least one role is required.`)
      return false;
    }

    // roles that the user has
    const userRoles: string[] = user.client_roles;

    this.logger.debug(`User Roles: ${userRoles}`);

    // does the user have a required role?
    return requiredRoles.some((role) => userRoles?.includes(role));
  }
}