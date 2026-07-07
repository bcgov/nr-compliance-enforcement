import { investigation_address } from "./investigation_address";
import { investigation_party } from "./investigation_party";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_contact_method {
  @ApiProperty({ type: String })
  investigation_contact_method_guid: string;

  @ApiPropertyOptional({ type: String })
  investigation_party_guid?: string;

  @ApiProperty({ type: String })
  contact_method_type_code_ref: string;

  @ApiProperty({ type: String })
  contact_value: string;

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
  investigation_address_guid?: string;

  @ApiPropertyOptional({ type: () => investigation_address })
  investigation_address?: investigation_address;

  @ApiPropertyOptional({ type: () => investigation_party })
  investigation_party?: investigation_party;
}
