import { activity_note_code } from "./activity_note_code";
import { investigation } from "./investigation";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class activity_note {
  @ApiProperty({ type: String })
  activity_note_guid: string;

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

  @ApiProperty({ type: String })
  activity_note_code: string;

  @ApiProperty({ type: () => activity_note_code })
  activity_note_code_activity_note_activity_note_codeToactivity_note_code: activity_note_code;

  @ApiProperty({ type: () => investigation })
  investigation: investigation;
}
