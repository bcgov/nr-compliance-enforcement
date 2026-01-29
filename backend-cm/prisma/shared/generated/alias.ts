import { business } from "./business";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class alias {
  @ApiProperty({ type: String })
  alias_guid: string;

  @ApiProperty({ type: String })
  business_guid: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: Boolean })
  active_ind?: boolean = true;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiProperty({ type: String })
  update_user_id: string;

  @ApiProperty({ type: Date })
  update_utc_timestamp: Date;

  @ApiProperty({ type: () => business })
  business: business;
}
