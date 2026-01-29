import { business } from "./business";
import { business_identifier_code } from "./business_identifier_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class business_identifier {
  @ApiProperty({ type: String })
  business_identifier_guid: string;

  @ApiProperty({ type: String })
  business_guid: string;

  @ApiProperty({ type: String })
  business_identifier_code: string;

  @ApiProperty({ type: String })
  identifier_value: string;

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

  @ApiProperty({ type: () => business_identifier_code })
  business_identifier_code_business_identifier_business_identifier_codeTobusiness_identifier_code: business_identifier_code;
}
