import { party } from "./party";
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

  @ApiPropertyOptional({ type: () => party })
  party?: party;
}
