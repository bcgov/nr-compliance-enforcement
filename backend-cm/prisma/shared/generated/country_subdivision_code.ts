import { business_address } from "./business_address";
import { country_code } from "./country_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class country_subdivision_code {
  @ApiProperty({ type: String })
  country_subdivision_code: string;

  @ApiProperty({ type: String })
  country_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiProperty({ type: Number })
  display_order: number;

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

  @ApiProperty({ isArray: true, type: () => business_address })
  business_address_business_address_country_subdivision_codeTocountry_subdivision_code: business_address[];

  @ApiProperty({ type: () => country_code })
  country_code_country_subdivision_code_country_codeTocountry_code: country_code;
}
