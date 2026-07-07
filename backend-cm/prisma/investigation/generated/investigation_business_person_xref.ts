import { investigation_business_person_address_xref } from "./investigation_business_person_address_xref";
import { investigation_business } from "./investigation_business";
import { investigation_person } from "./investigation_person";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_business_person_xref {
  @ApiProperty({ type: String })
  investigation_business_person_xref_guid: string;

  @ApiProperty({ type: String })
  investigation_business_guid: string;

  @ApiProperty({ type: String })
  investigation_person_guid: string;

  @ApiProperty({ type: String })
  business_person_xref_code_ref: string;

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

  @ApiPropertyOptional({ type: String })
  title_role?: string;

  @ApiProperty({ type: Boolean })
  is_primary: boolean;

  @ApiProperty({ isArray: true, type: () => investigation_business_person_address_xref })
  investigation_business_person_address_xref: investigation_business_person_address_xref[];

  @ApiProperty({ type: () => investigation_business })
  investigation_business: investigation_business;

  @ApiProperty({ type: () => investigation_person })
  investigation_person: investigation_person;
}
