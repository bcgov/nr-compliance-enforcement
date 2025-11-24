import { case_activity_type_code } from "./case_activity_type_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class party_association_role {
  @ApiProperty({ type: String })
  party_association_role: string;

  @ApiProperty({ type: String })
  case_activity_type_code: string;

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

  @ApiProperty({ type: () => case_activity_type_code })
  case_activity_type_code_party_association_role_case_activity_type_codeTocase_activity_type_code: case_activity_type_code;
}
