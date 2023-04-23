import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; @Injectable()
export class CedsAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  } canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  } handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    const roles: string[] = user.client_roles;
    if (!roles.includes('COS_OFFICER')) {
      throw new ForbiddenException();
    }
    return user;
  }
}