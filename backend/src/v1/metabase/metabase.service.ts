import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AppUserService } from "../app_user/app_user.service";

@Injectable()
export class MetabaseService {
  constructor(private readonly appUserService: AppUserService, private readonly jwtService: JwtService) {}

  /**
   * Returns the iframe URL for the Investigations at a glance dashboard, using Metabase static embedding.
   * See https://www.metabase.com/docs/v0.55/embedding/static-embedding
   *
   * The URL carries a JWT token signed by METABASE_SECRET_KEY. Get the secret in Metabase under Admin > Embedding.
   * Only the backend has the key, the browser only gets the signed token.
   *
   * The token is only valid for the resources and time or other parameters it was signed with:
   * - resource.dashboard: dashboard ID
   * - params.zone: a hard set filter passed to the dashboard
   *   https://www.metabase.com/docs/v0.55/embedding/static-embedding-parameters#restricting-data-in-a-static-embed-with-locked-parameters
   * - expiresIn: the token's expiration time
   */
  async getInvestigationsAtAGlanceUrl(user: any, token: string): Promise<string> {
    // Get the users zone
    const appUser = await this.appUserService.findByAuthUserGuid(user.idir_user_guid, token);
    const zoneName = appUser?.office_guid?.cos_geo_org_unit?.zone_name;

    // Users without an office have no zone, throw an exception instead of granting them full access
    if (!zoneName) {
      throw new NotFoundException();
    }

    const metabaseToken = this.jwtService.sign(
      {
        resource: { dashboard: Number(process.env.METABASE_INVESTIGATIONS_AT_A_GLANCE_DASHBOARD_ID) },
        params: { zone: zoneName },
      },
      { secret: process.env.METABASE_SECRET_KEY, expiresIn: "10m" },
    );

    // Some style params can be passed in the URL:
    // https://www.metabase.com/docs/v0.55/embedding/static-embedding-parameters#customizing-the-appearance-of-a-static-embed
    return `${process.env.METABASE_URL}/embed/dashboard/${metabaseToken}#bordered=false&titled=false`;
  }
}
