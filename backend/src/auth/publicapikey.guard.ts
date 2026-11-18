import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class PublicApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers["x-api-key"];

    if (apiKey && apiKey === process.env.PUBLIC_API_KEY) {
      return true;
    } else {
      throw new UnauthorizedException("Invalid or missing API key");
    }
  }
}
