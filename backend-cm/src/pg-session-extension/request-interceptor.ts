import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { Request } from "express";
import { GqlExecutionContext } from "@nestjs/graphql";

interface RequestWithUser extends Request {
  user?: {
    idir_user_guid?: string;
    client_roles?: string | string[];
    exp?: number;
    [key: string]: any;
  };
}

// AsyncLocalStorage to store the request context.
export const requestContext = new AsyncLocalStorage<RequestWithUser>();

export function getRequest(): RequestWithUser | undefined {
  return requestContext.getStore();
}

/**
 * RequestInterceptor is a NestInterceptor that catches all incoming requests
 * and stores them in an AsyncLocalStorage instance.
 * This allows us to get the JWT claims off of the user object to use for postgres session variables.
 * It is scoped to the individual requests lifecycle (each request gets its own AsyncLocalStorage instance)
 */
@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Handle both HTTP and GraphQL contexts
    let request: RequestWithUser;

    try {
      // Try GraphQL context first
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    } catch {
      // Fall back to HTTP context
      request = context.switchToHttp().getRequest();
    }

    // Store the request in AsyncLocalStorage
    return requestContext.run(request, () => {
      return next.handle();
    });
  }
}
