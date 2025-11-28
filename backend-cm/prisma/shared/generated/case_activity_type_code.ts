import { case_activity } from "./case_activity";
import { party_association_role_code } from "./party_association_role_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class case_activity_type_code {
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

  @ApiProperty({ isArray: true, type: () => case_activity })
  case_activity: case_activity[];

  @ApiProperty({ isArray: true, type: () => party_association_role_code })
  party_association_role_code_party_association_role_code_case_activity_type_codeTocase_activity_type_code: party_association_role_code[];
}
