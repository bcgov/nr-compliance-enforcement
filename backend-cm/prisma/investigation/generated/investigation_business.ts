import { investigation_party } from "./investigation_party";
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

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiPropertyOptional({ type: () => investigation_party })
  investigation_party?: investigation_party;
}
