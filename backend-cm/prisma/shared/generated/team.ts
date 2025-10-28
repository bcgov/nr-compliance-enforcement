import { app_user_team_xref } from "./app_user_team_xref";
import { agency_code } from "./agency_code";
import { team_code } from "./team_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class team {
  @ApiProperty({ type: String })
  team_guid: string;

  @ApiProperty({ type: String })
  team_code: string;

  @ApiProperty({ type: String })
  agency_code_ref: string;

  @ApiProperty({ type: Boolean })
  active_ind: boolean = true;

  @ApiPropertyOptional({ type: String })
  create_user_id?: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiProperty({ type: Date })
  update_utc_timestamp: Date;

  @ApiProperty({ isArray: true, type: () => app_user_team_xref })
  app_user_team_xref: app_user_team_xref[];

  @ApiProperty({ type: () => agency_code })
  agency_code: agency_code;

  @ApiProperty({ type: () => team_code })
  team_code_team_team_codeToteam_code: team_code;
}
