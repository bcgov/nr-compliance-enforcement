import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtRoleGuard } from "./jwtrole.guard";
import { ApiKeyGuard } from "./apikey.guard";

@Injectable()
export class JwtOrApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(JwtOrApiKeyGuard.name);
  private jwtRoleGuard: JwtRoleGuard;
  private apiKeyGuard: ApiKeyGuard;

  constructor(private reflector: Reflector) {
    this.jwtRoleGuard = new JwtRoleGuard(reflector);
    this.apiKeyGuard = new ApiKeyGuard();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // API Key auth
    const apiKeyResult = this.apiKeyGuard.canActivate(context);
    if (apiKeyResult) {
      return true;
    }

    // JWT auth
    const jwtResult = await this.jwtRoleGuard.canActivate(context);
    if (jwtResult) {
      return true;
    }

    return false;
  }
}
