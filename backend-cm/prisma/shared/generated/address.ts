import { country_code } from "./country_code";
import { country_subdivision_code } from "./country_subdivision_code";
import { party } from "./party";
import { business_person_address_xref } from "./business_person_address_xref";
import { contact_method } from "./contact_method";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class address {
  @ApiProperty({ type: String })
  address_guid: string;

  @ApiProperty({ type: String })
  party_guid: string;

  @ApiProperty({ type: String })
  address_name: string;

  @ApiPropertyOptional({ type: String })
  address?: string;

  @ApiPropertyOptional({ type: String })
  city?: string;

  @ApiPropertyOptional({ type: String })
  country_subdivision_code?: string;

  @ApiPropertyOptional({ type: String })
  postal_code?: string;

  @ApiPropertyOptional({ type: String })
  country_code?: string;

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

  @ApiPropertyOptional({ type: String })
  nickname?: string;

  @ApiProperty({ type: Boolean })
  display_in_investigation_ind: boolean = true;

  @ApiPropertyOptional({ type: () => country_code })
  country_code_address_country_codeTocountry_code?: country_code;

  @ApiPropertyOptional({ type: () => country_subdivision_code })
  country_subdivision_code_address_country_subdivision_codeTocountry_subdivision_code?: country_subdivision_code;

  @ApiProperty({ type: () => party })
  party: party;

  @ApiProperty({ isArray: true, type: () => business_person_address_xref })
  business_person_address_xref: business_person_address_xref[];

  @ApiProperty({ isArray: true, type: () => contact_method })
  contact_method: contact_method[];
}
