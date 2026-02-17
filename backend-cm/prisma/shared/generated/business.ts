import { alias } from "./alias";
import { party } from "./party";
import { business_identifier } from "./business_identifier";
import { business_person_xref } from "./business_person_xref";
import { contact_method } from "./contact_method";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class business {
  @ApiProperty({ type: String })
  business_guid: string;

  @ApiProperty({ type: String })
  name: string;

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

  @ApiProperty({ isArray: true, type: () => alias })
  alias: alias[];

  @ApiPropertyOptional({ type: () => party })
  party?: party;

  @ApiProperty({ isArray: true, type: () => business_identifier })
  business_identifier: business_identifier[];

  @ApiProperty({ isArray: true, type: () => business_person_xref })
  business_person_xref: business_person_xref[];

  @ApiProperty({ isArray: true, type: () => contact_method })
  contact_method: contact_method[];
}
