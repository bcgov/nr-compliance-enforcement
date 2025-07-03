import { SetMetadata } from "@nestjs/common";

/**
 * Decorator used to indicate if an API need not be authenticated.
 * If @Public is present either on the class or method, then the API will not require authentication
 */
export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
