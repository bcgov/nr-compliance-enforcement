import { investigation } from "./investigation";
import { contravention_party_xref } from "./contravention_party_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class contravention {
  @ApiProperty({ type: String })
  contravention_guid: string;

  @ApiPropertyOptional({ type: String })
  investigation_guid?: string;

  @ApiProperty({ type: String })
  legislation_guid_ref: string;

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

  @ApiPropertyOptional({ type: () => investigation })
  investigation?: investigation;

  @ApiProperty({ isArray: true, type: () => contravention_party_xref })
  contravention_party_xref: contravention_party_xref[];
}
