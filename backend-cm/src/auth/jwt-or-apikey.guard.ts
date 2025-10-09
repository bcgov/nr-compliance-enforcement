import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from "./jwtauth.guard";
import { JwtRoleGuard } from "./jwtrole.guard";
import { ApiKeyGuard } from "./apikey.guard";

@Injectable()
export class JwtOrApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(JwtOrApiKeyGuard.name);
  private jwtAuthGuard: JwtAuthGuard;
  private jwtRoleGuard: JwtRoleGuard;
  private apiKeyGuard: ApiKeyGuard;

  constructor(private reflector: Reflector) {
    this.jwtAuthGuard = new JwtAuthGuard(reflector);
    this.jwtRoleGuard = new JwtRoleGuard(reflector);
    this.apiKeyGuard = new ApiKeyGuard();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const apiKeyResult = this.apiKeyGuard.canActivate(context);
    if (apiKeyResult) {
      return true;
    }

    const jwtAuthResult = await this.jwtAuthGuard.canActivate(context);
    if (jwtAuthResult) {
      const jwtRoleResult = await this.jwtRoleGuard.canActivate(context);
      if (jwtRoleResult) {
        return true;
      }
    }

    return false;
  }
}
