import { address } from "./address";
import { alias } from "./alias";
import { business } from "./business";
import { contact_method } from "./contact_method";
import { party_type_code } from "./party_type_code";
import { person } from "./person";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class party {
  @ApiProperty({ type: String })
  party_guid: string;

  @ApiPropertyOptional({ type: String })
  party_type?: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ isArray: true, type: () => address })
  address: address[];

  @ApiProperty({ isArray: true, type: () => alias })
  alias: alias[];

  @ApiPropertyOptional({ type: () => business })
  business?: business;

  @ApiProperty({ isArray: true, type: () => contact_method })
  contact_method: contact_method[];

  @ApiPropertyOptional({ type: () => party_type_code })
  party_type_code?: party_type_code;

  @ApiPropertyOptional({ type: () => person })
  person?: person;
}
