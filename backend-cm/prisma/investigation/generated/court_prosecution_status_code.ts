import { court_prosecution } from "./court_prosecution";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class court_prosecution_status_code {
  @ApiProperty({ type: String })
  court_prosecution_status_code: string;

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

  @ApiProperty({ isArray: true, type: () => court_prosecution })
  court_prosecution_court_prosecution_court_prosecution_status_codeTocourt_prosecution_status_code: court_prosecution[];
}
