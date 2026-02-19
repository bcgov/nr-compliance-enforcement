import { business_person_xref } from "./business_person_xref";
import { contact_method } from "./contact_method";
import { party } from "./party";
import { sex_code } from "./sex_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class person {
  @ApiProperty({ type: String })
  person_guid: string;

  @ApiProperty({ type: String })
  first_name: string;

  @ApiPropertyOptional({ type: String })
  middle_name?: string;

  @ApiPropertyOptional({ type: String })
  middle_name_2?: string;

  @ApiProperty({ type: String })
  last_name: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiPropertyOptional({ type: String })
  party_guid?: string;

  @ApiPropertyOptional({ type: Date })
  date_of_birth?: Date;

  @ApiPropertyOptional({ type: String })
  drivers_license_number?: string;

  @ApiPropertyOptional({ type: String })
  drivers_license_jurisdiction?: string;

  @ApiPropertyOptional({ type: String })
  sex_code?: string;

  @ApiProperty({ isArray: true, type: () => business_person_xref })
  business_person_xref: business_person_xref[];

  @ApiProperty({ isArray: true, type: () => contact_method })
  contact_method: contact_method[];

  @ApiPropertyOptional({ type: () => party })
  party?: party;

  @ApiPropertyOptional({ type: () => sex_code })
  sex_code_person_sex_codeTosex_code?: sex_code;
}
