import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from "./jwtauth.guard";
import { JwtRoleGuard } from "./jwtrole.guard";
import { ApiKeyGuard } from "./apikey.guard";

@Injectable()
export class JwtOrApiKeyGuard implements CanActivate {
  private readonly jwtAuthGuard: JwtAuthGuard;
  private readonly jwtRoleGuard: JwtRoleGuard;
  private readonly apiKeyGuard: ApiKeyGuard;

  constructor(private readonly reflector: Reflector) {
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
      const jwtRoleResult = this.jwtRoleGuard.canActivate(context);
      if (jwtRoleResult) {
        return true;
      }
    }

    return false;
  }
}
