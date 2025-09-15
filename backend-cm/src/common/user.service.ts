import { Injectable, Inject, Scope, Logger } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@Inject(REQUEST) private readonly request: any) {}

  getUser(): any {
    return this.request?.req.user || null;
  }

  getIdirUsername(): string {
    this.logger.log(this.getUser());
    try {
      return this.getUser()?.idir_username || "system";
    } catch {
      return "system";
    }
  }
}
