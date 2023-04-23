import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; @Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor() {
    super();
  } canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  } handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error("JWT Is not Valid");
      throw err || new UnauthorizedException();
    }
    const roles: string[] = user.client_roles;
    if (!roles.includes('COS_OFFICER')) {
      this.logger.error("User is not in any role");
      throw new ForbiddenException();
    }
    return user;
  }
}