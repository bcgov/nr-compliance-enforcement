import { investigation_business_person_xref } from "./investigation_business_person_xref";
import { investigation_party } from "./investigation_party";
import { investigation_person_facial_hair_style_code_ref } from "./investigation_person_facial_hair_style_code_ref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_person {
  @ApiProperty({ type: String })
  investigation_person_guid: string;

  @ApiPropertyOptional({ type: String })
  person_guid_ref?: string;

  @ApiPropertyOptional({ type: String })
  investigation_party_guid?: string;

  @ApiPropertyOptional({ type: String })
  first_name?: string;

  @ApiPropertyOptional({ type: String })
  middle_names?: string;

  @ApiPropertyOptional({ type: String })
  last_name?: string;

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

  @ApiPropertyOptional({ type: Date })
  date_of_birth?: Date;

  @ApiPropertyOptional({ type: String })
  drivers_license_number?: string;

  @ApiPropertyOptional({ type: String })
  approximate_age_code_ref?: string;

  @ApiPropertyOptional({ type: String })
  gender_code_ref?: string;

  @ApiPropertyOptional({ type: String })
  drivers_license_class?: string;

  @ApiPropertyOptional({ type: String })
  drivers_license_country_code_ref?: string;

  @ApiPropertyOptional({ type: String })
  drivers_license_country_subdivision_code_ref?: string;

  @ApiPropertyOptional({ type: Number })
  height_cm?: number;

  @ApiPropertyOptional({ type: Number })
  weight_kg?: number;

  @ApiPropertyOptional({ type: String })
  complexion_code_ref?: string;

  @ApiPropertyOptional({ type: String })
  build_code_ref?: string;

  @ApiPropertyOptional({ type: String })
  hair_colour_code_ref?: string;

  @ApiPropertyOptional({ type: String })
  hair_colour_other?: string;

  @ApiPropertyOptional({ type: String })
  hair_length_code_ref?: string;

  @ApiPropertyOptional({ type: String })
  eye_colour_code_ref?: string;

  @ApiPropertyOptional({ type: String })
  eye_colour_other?: string;

  @ApiPropertyOptional({ type: Boolean })
  facial_hair_ind?: boolean;

  @ApiPropertyOptional({ type: String })
  additional_hair_descriptors?: string;

  @ApiPropertyOptional({ type: Boolean })
  tattoo_ind?: boolean;

  @ApiPropertyOptional({ type: String })
  tattoo_description?: string;

  @ApiPropertyOptional({ type: String })
  additional_descriptors?: string;

  @ApiPropertyOptional({ type: String })
  comments?: string;

  @ApiPropertyOptional({ type: Boolean })
  bolo_ind?: boolean;

  @ApiProperty({ isArray: true, type: () => investigation_business_person_xref })
  investigation_business_person_xref: investigation_business_person_xref[];

  @ApiPropertyOptional({ type: () => investigation_party })
  investigation_party?: investigation_party;

  @ApiProperty({ isArray: true, type: () => investigation_person_facial_hair_style_code_ref })
  investigation_person_facial_hair_style_code_ref: investigation_person_facial_hair_style_code_ref[];
}
