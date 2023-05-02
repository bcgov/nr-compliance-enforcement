import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';@Injectable()

/**
 * JWT Auth Strategy for Passport.  Uses the BC Ministry's OIDC well-known endpoints for a public cert to verify the JWT signature
 */
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:process.env.JWKS_URI
      }),jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.KEYCLOCK_CLIENT_ID,
      issuer: process.env.JWT_ISSUER,
      algorithms: ['RS256'],
    });
  }validate(payload: unknown): unknown {
    return payload;
  }
}