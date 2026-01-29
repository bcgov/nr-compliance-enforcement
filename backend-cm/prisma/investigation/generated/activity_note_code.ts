import { activity_note } from "./activity_note";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class activity_note_code {
  @ApiProperty({ type: String })
  activity_note_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiPropertyOptional({ type: Number })
  display_order?: number;

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

  @ApiProperty({ isArray: true, type: () => activity_note })
  activity_note_activity_note_activity_note_codeToactivity_note_code: activity_note[];
}
