import { investigation_party } from "./investigation_party";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_person {
  @ApiProperty({ type: String })
  investigation_person_guid: string;

  @ApiPropertyOptional({ type: String })
  person_guid_ref?: string;

  @ApiPropertyOptional({ type: String })
  investigation_party_guid?: string;

  @ApiProperty({ type: String })
  first_name: string;

  @ApiPropertyOptional({ type: String })
  middle_name?: string;

  @ApiPropertyOptional({ type: String })
  middle_name_2?: string;

  @ApiProperty({ type: String })
  last_name: string;

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

  @ApiPropertyOptional({ type: () => investigation_party })
  investigation_party?: investigation_party;
}
