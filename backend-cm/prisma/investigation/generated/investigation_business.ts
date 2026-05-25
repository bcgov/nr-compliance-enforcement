import { investigation_alias } from "./investigation_alias";
import { investigation_party } from "./investigation_party";
import { investigation_business_identifier } from "./investigation_business_identifier";
import { investigation_contact_method } from "./investigation_contact_method";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_business {
  @ApiProperty({ type: String })
  investigation_business_guid: string;

  @ApiPropertyOptional({ type: String })
  business_guid_ref?: string;

  @ApiPropertyOptional({ type: String })
  investigation_party_guid?: string;

  @ApiProperty({ type: String })
  name: string;

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

  @ApiProperty({ isArray: true, type: () => investigation_alias })
  investigation_alias: investigation_alias[];

  @ApiPropertyOptional({ type: () => investigation_party })
  investigation_party?: investigation_party;

  @ApiProperty({ isArray: true, type: () => investigation_business_identifier })
  investigation_business_identifier: investigation_business_identifier[];

  @ApiProperty({ isArray: true, type: () => investigation_contact_method })
  investigation_contact_method: investigation_contact_method[];
}
