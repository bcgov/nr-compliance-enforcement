import { UnauthorizedException } from "@nestjs/common";

// These are deliberately collapsed so we don't leak whether a record exists.
export class UnauthorizedAccessException extends UnauthorizedException {
  constructor(message = "You do not have access to this resource.") {
    super(message);
  }
}

export const UNAUTHORIZED_ERROR_CODE = "UNAUTHORIZED";
