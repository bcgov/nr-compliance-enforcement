import { investigation_business } from "./investigation_business";
import { investigation } from "./investigation";
import { investigation_person } from "./investigation_person";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_party {
  @ApiProperty({ type: String })
  investigation_party_guid: string;

  @ApiPropertyOptional({ type: String })
  party_guid_ref?: string;

  @ApiProperty({ type: String })
  party_type_code_ref: string;

  @ApiProperty({ type: String })
  investigation_guid: string;

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

  @ApiPropertyOptional({ type: String })
  party_association_role_ref?: string;

  @ApiProperty({ isArray: true, type: () => investigation_business })
  investigation_business: investigation_business[];

  @ApiProperty({ type: () => investigation })
  investigation: investigation;

  @ApiProperty({ isArray: true, type: () => investigation_person })
  investigation_person: investigation_person[];
}
