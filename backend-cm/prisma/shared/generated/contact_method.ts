import { person } from "./person";
import { contact_method_type_code } from "./contact_method_type_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class contact_method {
  @ApiProperty({ type: String })
  contact_method_guid: string;

  @ApiProperty({ type: String })
  person_guid: string;

  @ApiProperty({ type: String })
  contact_method_type_code: string;

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

  @ApiProperty({ type: () => person })
  person: person;

  @ApiProperty({ type: () => contact_method_type_code })
  contact_method_type_code_contact_method_contact_method_type_codeTocontact_method_type_code: contact_method_type_code;
}
