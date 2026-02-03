import { investigation } from "./investigation";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class continuation_report {
  @ApiProperty({ type: String })
  continuation_report_guid: string;

  @ApiProperty({ type: String })
  investigation_guid: string;

  @ApiProperty({ type: Object })
  content_json: object;

  @ApiPropertyOptional({ type: String })
  content_text?: string;

  @ApiPropertyOptional({ type: Date })
  actioned_utc_timestamp?: Date;

  @ApiPropertyOptional({ type: String })
  actioned_app_user_guid_ref?: string;

  @ApiPropertyOptional({ type: Date })
  reported_utc_timestamp?: Date;

  @ApiPropertyOptional({ type: String })
  reported_app_user_guid_ref?: string;

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

  @ApiProperty({ type: () => investigation })
  investigation: investigation;
}
