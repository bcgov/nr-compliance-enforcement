import { person_facial_hair_style_code } from "./person_facial_hair_style_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class facial_hair_style_code {
  @ApiProperty({ type: String })
  facial_hair_style_code: string;

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

  @ApiProperty({ isArray: true, type: () => person_facial_hair_style_code })
  person_facial_hair_style_code_person_facial_hair_style_code_facial_hair_style_codeTofacial_hair_style_code: person_facial_hair_style_code[];
}
