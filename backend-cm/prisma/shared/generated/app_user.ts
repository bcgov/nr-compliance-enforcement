import { agency_code } from "./agency_code";
import { office } from "./office";
import { app_user_team_xref } from "./app_user_team_xref";
import { case_file } from "./case_file";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class app_user {
  @ApiProperty({ type: String })
  app_user_guid: string;

  @ApiPropertyOptional({ type: String })
  auth_user_guid?: string;

  @ApiPropertyOptional({ type: String })
  user_id?: string;

  @ApiPropertyOptional({ type: String })
  first_name?: string;

  @ApiPropertyOptional({ type: String })
  last_name?: string;

  @ApiPropertyOptional({ type: Boolean })
  coms_enrolled_ind?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  deactivate_ind?: boolean;

  @ApiPropertyOptional({ type: String })
  agency_code_ref?: string;

  @ApiPropertyOptional({ type: String })
  office_guid?: string;

  @ApiPropertyOptional({ type: String })
  park_area_guid?: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiProperty({ type: String })
  update_user_id: string;

  @ApiProperty({ type: Date })
  update_utc_timestamp: Date;

  @ApiPropertyOptional({ type: () => agency_code })
  agency_code?: agency_code;

  @ApiPropertyOptional({ type: () => office })
  office?: office;

  @ApiProperty({ isArray: true, type: () => app_user_team_xref })
  app_user_team_xref: app_user_team_xref[];

  @ApiProperty({ isArray: true, type: () => case_file })
  case_file: case_file[];
}
