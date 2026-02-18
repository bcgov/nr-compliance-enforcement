import { business } from "./business";
import { person } from "./person";
import { contact_method_type_code } from "./contact_method_type_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class contact_method {
  @ApiProperty({ type: String })
  contact_method_guid: string;

  @ApiPropertyOptional({ type: String })
  person_guid?: string;

  @ApiProperty({ type: String })
  contact_method_type: string;

  @ApiPropertyOptional({ type: String })
  contact_value?: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: Boolean })
  is_primary: boolean;

  @ApiProperty({ type: Boolean })
  active_ind: boolean = true;

  @ApiPropertyOptional({ type: String })
  business_guid?: string;

  @ApiPropertyOptional({ type: () => business })
  business?: business;

  @ApiPropertyOptional({ type: () => person })
  person?: person;

  @ApiProperty({ type: () => contact_method_type_code })
  contact_method_type_code: contact_method_type_code;
}
