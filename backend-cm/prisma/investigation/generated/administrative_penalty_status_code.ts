import { administrative_penalty } from "./administrative_penalty";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class administrative_penalty_status_code {
  @ApiProperty({ type: String })
  administrative_penalty_status_code: string;

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

  @ApiProperty({ isArray: true, type: () => administrative_penalty })
  administrative_penalty_administrative_penalty_administrative_penalty_status_codeToadministrative_penalty_status_code: administrative_penalty[];
}
