import { contact_method } from "./contact_method";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class contact_method_type_code {
  @ApiProperty({ type: String })
  contact_method_type_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiPropertyOptional({ type: Number })
  display_order?: number;

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

  @ApiProperty({ isArray: true, type: () => contact_method })
  contact_method_contact_method_contact_method_type_codeTocontact_method_type_code: contact_method[];
}
