import { case_activity } from "./case_activity";
import { agency_code } from "./agency_code";
import { case_status_code } from "./case_status_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class case_file {
  @ApiProperty({ type: String })
  case_file_guid: string;

  @ApiProperty({ type: String })
  lead_agency: string;

  @ApiProperty({ type: String })
  case_status: string;

  @ApiProperty({ type: Date })
  opened_utc_timestamp: Date;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  created_by_app_user_guid_ref?: string;

  @ApiProperty({ isArray: true, type: () => case_activity })
  case_activity: case_activity[];

  @ApiProperty({ type: () => agency_code })
  agency_code: agency_code;

  @ApiProperty({ type: () => case_status_code })
  case_status_code: case_status_code;
}
