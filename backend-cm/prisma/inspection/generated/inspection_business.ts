import { inspection_party } from "./inspection_party";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class inspection_business {
  @ApiProperty({ type: String })
  inspection_business_guid: string;

  @ApiPropertyOptional({ type: String })
  business_guid_ref?: string;

  @ApiPropertyOptional({ type: String })
  inspection_party_guid?: string;

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

  @ApiPropertyOptional({ type: () => inspection_party })
  inspection_party?: inspection_party;
}
