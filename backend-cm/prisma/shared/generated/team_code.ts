import { team } from "./team";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class team_code {
  @ApiProperty({ type: String })
  team_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiProperty({ type: Number })
  display_order: number;

  @ApiProperty({ type: Boolean })
  active_ind: boolean;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiProperty({ type: String })
  update_user_id: string;

  @ApiProperty({ type: Date })
  update_utc_timestamp: Date;

  @ApiProperty({ isArray: true, type: () => team })
  team_team_team_codeToteam_code: team[];
}
