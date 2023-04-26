import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/enum/role.enum';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class JwtRoleGuard extends AuthGuard('jwt') {

  private readonly logger = new Logger(JwtRoleGuard.name);

  constructor(private reflector: Reflector) {
    super();
  } 
  
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        "Cannot verify user authorization",
      );
    }

    // get the roles associated with the request
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);       

    // if there aren't any required roles, don't allow the user to access any api.  All users need at least one role
    if (!requiredRoles) {
      return false;
    }

    // roles that the user has
    const userRoles: string[] = user.client_roles;

    this.logger.debug(`Guarded Roles: ${requiredRoles}`);
    this.logger.debug(`User Roles: ${userRoles}`);

    // does the user have a required role?
    return requiredRoles.some((role) => userRoles?.includes(role));
  }
}