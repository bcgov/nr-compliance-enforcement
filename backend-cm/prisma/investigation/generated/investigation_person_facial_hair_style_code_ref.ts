import { investigation_person } from "./investigation_person";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_person_facial_hair_style_code_ref {
  @ApiProperty({ type: String })
  investigation_person_facial_hair_style_code_ref_guid: string;

  @ApiProperty({ type: String })
  investigation_person_guid: string;

  @ApiProperty({ type: String })
  facial_hair_style_code_ref: string;

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

  @ApiProperty({ type: () => investigation_person })
  investigation_person: investigation_person;
}
