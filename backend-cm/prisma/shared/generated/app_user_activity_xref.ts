import { case_activity_type_code } from "./case_activity_type_code";
import { app_user } from "./app_user";
import { app_user_activity_xref_code } from "./app_user_activity_xref_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class app_user_activity_xref {
  @ApiProperty({ type: String })
  app_user_activity_xref_guid: string;

  @ApiProperty({ type: String })
  app_user_guid: string;

  @ApiProperty({ type: String })
  activity_type: string;

  @ApiProperty({ type: String })
  activity_identifier_ref: string;

  @ApiProperty({ type: String })
  app_user_activity_xref_code: string;

  @ApiProperty({ type: Boolean })
  active_ind: boolean = true;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: () => case_activity_type_code })
  case_activity_type_code: case_activity_type_code;

  @ApiProperty({ type: () => app_user })
  app_user: app_user;

  @ApiProperty({ type: () => app_user_activity_xref_code })
  app_user_activity_xref_code_app_user_activity_xref_app_user_activity_xref_codeToapp_user_activity_xref_code: app_user_activity_xref_code;
}
