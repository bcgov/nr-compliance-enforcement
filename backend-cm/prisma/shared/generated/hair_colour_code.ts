import { person } from "./person";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class hair_colour_code {
  @ApiProperty({ type: String })
  hair_colour_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiProperty({ type: Number })
  display_order: number;

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

  @ApiProperty({ isArray: true, type: () => person })
  person_person_hair_colour_codeTohair_colour_code: person[];
}
