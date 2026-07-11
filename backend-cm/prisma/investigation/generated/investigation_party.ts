import { contravention_party_xref } from "./contravention_party_xref";
import { investigation_address } from "./investigation_address";
import { investigation_alias } from "./investigation_alias";
import { investigation_attachment_reference } from "./investigation_attachment_reference";
import { investigation_business } from "./investigation_business";
import { investigation_contact_method } from "./investigation_contact_method";
import { investigation } from "./investigation";
import { investigation_person } from "./investigation_person";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_party {
  @ApiProperty({ type: String })
  investigation_party_guid: string;

  @ApiPropertyOptional({ type: String })
  party_guid_ref?: string;

  @ApiProperty({ type: String })
  party_type_code_ref: string;

  @ApiProperty({ type: String })
  investigation_guid: string;

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
  party_association_role_ref?: string;

  @ApiPropertyOptional({ type: String })
  created_by_app_user_guid_ref?: string;

  @ApiPropertyOptional({ type: String })
  placeholder_name?: string;

  @ApiPropertyOptional({ type: Number })
  placeholder_number?: number;

  @ApiProperty({ isArray: true, type: () => contravention_party_xref })
  contravention_party_xref: contravention_party_xref[];

  @ApiProperty({ isArray: true, type: () => investigation_address })
  investigation_address: investigation_address[];

  @ApiProperty({ isArray: true, type: () => investigation_alias })
  investigation_alias: investigation_alias[];

  @ApiProperty({ isArray: true, type: () => investigation_attachment_reference })
  investigation_attachment_reference: investigation_attachment_reference[];

  @ApiProperty({ isArray: true, type: () => investigation_business })
  investigation_business: investigation_business[];

  @ApiProperty({ isArray: true, type: () => investigation_contact_method })
  investigation_contact_method: investigation_contact_method[];

  @ApiProperty({ type: () => investigation })
  investigation: investigation;

  @ApiProperty({ isArray: true, type: () => investigation_person })
  investigation_person: investigation_person[];
}
