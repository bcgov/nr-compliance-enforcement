import { business_person_xref } from "./business_person_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class business_person_xref_code {
  @ApiProperty({ type: String })
  business_person_xref_code: string;

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

  @ApiProperty({ isArray: true, type: () => business_person_xref })
  business_person_xref_business_person_xref_business_person_xref_codeTobusiness_person_xref_code: business_person_xref[];
}
