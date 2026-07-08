import { investigation_address } from "./investigation_address";
import { investigation_business_person_xref } from "./investigation_business_person_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_business_person_address_xref {
  @ApiProperty({ type: String })
  investigation_business_person_address_xref_guid: string;

  @ApiProperty({ type: String })
  investigation_business_person_xref_guid: string;

  @ApiProperty({ type: String })
  investigation_address_guid: string;

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

  @ApiProperty({ type: () => investigation_address })
  investigation_address: investigation_address;

  @ApiProperty({ type: () => investigation_business_person_xref })
  investigation_business_person_xref: investigation_business_person_xref;
}
