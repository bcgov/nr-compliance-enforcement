import { business_person_xref } from "./business_person_xref";
import { contact_method } from "./contact_method";
import { party } from "./party";
import { approximate_age_code } from "./approximate_age_code";
import { country_code } from "./country_code";
import { country_subdivision_code } from "./country_subdivision_code";
import { gender_code } from "./gender_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class person {
  @ApiProperty({ type: String })
  person_guid: string;

  @ApiProperty({ type: String })
  first_name: string;

  @ApiPropertyOptional({ type: String })
  middle_names?: string;

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
  approximate_age_code?: string;

  @ApiPropertyOptional({ type: String })
  gender_code?: string;

  @ApiPropertyOptional({ type: String })
  drivers_license_class?: string;

  @ApiPropertyOptional({ type: String })
  drivers_license_country_code?: string;

  @ApiPropertyOptional({ type: String })
  drivers_license_country_subdivision_code?: string;

  @ApiProperty({ isArray: true, type: () => business_person_xref })
  business_person_xref: business_person_xref[];

  @ApiProperty({ isArray: true, type: () => contact_method })
  contact_method: contact_method[];

  @ApiPropertyOptional({ type: () => party })
  party?: party;

  @ApiPropertyOptional({ type: () => approximate_age_code })
  approximate_age_code_person_approximate_age_codeToapproximate_age_code?: approximate_age_code;

  @ApiPropertyOptional({ type: () => country_code })
  country_code?: country_code;

  @ApiPropertyOptional({ type: () => country_subdivision_code })
  country_subdivision_code?: country_subdivision_code;

  @ApiPropertyOptional({ type: () => gender_code })
  gender_code_person_gender_codeTogender_code?: gender_code;
}
