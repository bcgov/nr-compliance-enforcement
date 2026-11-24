import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { SharedPrismaService } from "../prisma/shared/prisma.shared.service";
@Injectable()

/**
 * JWT Auth Strategy for Passport.  Uses the BC Ministry's OIDC well-known endpoints for a public cert to verify the JWT signature
 */
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtAuthStrategy.name);

  constructor(private readonly prisma: SharedPrismaService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKS_URI,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.KEYCLOCK_CLIENT_ID,
      issuer: process.env.JWT_ISSUER,
      algorithms: ["RS256"],
    });
    this.logger.debug(`JWK_URI: ${process.env.JWKS_URI}`);
    this.logger.debug(`KEYCLOCK_CLIENT_ID: ${process.env.KEYCLOCK_CLIENT_ID}`);
    this.logger.debug(`JWT_ISSUER: ${process.env.JWT_ISSUER}`);
  }
  // Activity roles are in the shared schema, which RLS can't access, so they're added to the user for the claims and access checks
  async validate(payload: any): Promise<any> {
    if (!payload?.idir_user_guid) {
      return payload;
    }
    const activities = await this.prisma.app_user_activity_xref.findMany({
      where: {
        active_ind: true,
        app_user: { auth_user_guid: payload.idir_user_guid },
      },
      select: { activity_identifier_ref: true },
    });
    return {
      ...payload,
      app_user_activity_identifiers: activities.map((activity) => activity.activity_identifier_ref),
    };
  }
}
