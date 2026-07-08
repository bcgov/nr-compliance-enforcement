import { address } from "./address";
import { business_person_xref } from "./business_person_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class business_person_address_xref {
  @ApiProperty({ type: String })
  business_person_address_xref_guid: string;

  @ApiProperty({ type: String })
  business_person_xref_guid: string;

  @ApiProperty({ type: String })
  address_guid: string;

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

  @ApiProperty({ type: () => address })
  address: address;

  @ApiProperty({ type: () => business_person_xref })
  business_person_xref: business_person_xref;
}
