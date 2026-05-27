import { investigation_business } from "./investigation_business";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_business_address {
  @ApiProperty({ type: String })
  investigation_business_address_guid: string;

  @ApiProperty({ type: String })
  investigation_business_guid: string;

  @ApiProperty({ type: String })
  address_name: string;

  @ApiPropertyOptional({ type: String })
  address?: string;

  @ApiPropertyOptional({ type: String })
  city?: string;

  @ApiPropertyOptional({ type: String })
  province?: string;

  @ApiPropertyOptional({ type: String })
  postal_code?: string;

  @ApiPropertyOptional({ type: String })
  country?: string;

  @ApiProperty({ type: Boolean })
  is_primary: boolean;

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
