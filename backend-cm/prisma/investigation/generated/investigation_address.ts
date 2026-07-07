import { investigation_party } from "./investigation_party";
import { investigation_business_person_address_xref } from "./investigation_business_person_address_xref";
import { investigation_contact_method } from "./investigation_contact_method";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_address {
  @ApiProperty({ type: String })
  investigation_address_guid: string;

  @ApiProperty({ type: String })
  investigation_party_guid: string;

  @ApiProperty({ type: String })
  address_name: string;

  @ApiPropertyOptional({ type: String })
  address?: string;

  @ApiPropertyOptional({ type: String })
  city?: string;

  @ApiPropertyOptional({ type: String })
  country_subdivision_code_ref?: string;

  @ApiPropertyOptional({ type: String })
  postal_code?: string;

  @ApiPropertyOptional({ type: String })
  country_code_ref?: string;

  @ApiProperty({ type: Boolean })
  is_primary: boolean;

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

  @ApiProperty({ type: Boolean })
  display_in_investigation_ind: boolean = true;

  @ApiProperty({ type: () => investigation_party })
  investigation_party: investigation_party;

  @ApiProperty({ isArray: true, type: () => investigation_business_person_address_xref })
  investigation_business_person_address_xref: investigation_business_person_address_xref[];

  @ApiProperty({ isArray: true, type: () => investigation_contact_method })
  investigation_contact_method: investigation_contact_method[];
}
