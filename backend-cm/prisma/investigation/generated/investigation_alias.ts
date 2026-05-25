import { investigation_business } from "./investigation_business";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_alias {
  @ApiProperty({ type: String })
  investigation_alias_guid: string;

  @ApiProperty({ type: String })
  investigation_business_guid: string;

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

  @ApiProperty({ type: () => investigation_business })
  investigation_business: investigation_business;
}
