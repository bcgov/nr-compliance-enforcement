import { business } from "./business";
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

  @ApiPropertyOptional({ type: () => business })
  business?: business;

  @ApiPropertyOptional({ type: () => party_type_code })
  party_type_code?: party_type_code;

  @ApiPropertyOptional({ type: () => person })
  person?: person;
}
