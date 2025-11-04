// src/guards/api-key-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request;

    const apiKey = request?.headers?.["x-api-key"];

    if (apiKey && apiKey === process.env.CASE_API_KEY) {
      return true;
    }

    return false;
  }
}
