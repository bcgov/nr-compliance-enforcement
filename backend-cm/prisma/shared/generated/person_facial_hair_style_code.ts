import { facial_hair_style_code } from "./facial_hair_style_code";
import { person } from "./person";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class person_facial_hair_style_code {
  @ApiProperty({ type: String })
  person_facial_hair_style_code_guid: string;

  @ApiProperty({ type: String })
  person_guid: string;

  @ApiProperty({ type: String })
  facial_hair_style_code: string;

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

  @ApiProperty({ type: () => facial_hair_style_code })
  facial_hair_style_code_person_facial_hair_style_code_facial_hair_style_codeTofacial_hair_style_code: facial_hair_style_code;

  @ApiProperty({ type: () => person })
  person: person;
}
