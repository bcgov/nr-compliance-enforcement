import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  } canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
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