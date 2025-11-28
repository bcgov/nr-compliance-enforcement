import { contravention } from "./contravention";
import { investigation_party } from "./investigation_party";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class contravention_party_xref {
  @ApiProperty({ type: String })
  contravention_party_xref_guid: string;

  @ApiPropertyOptional({ type: String })
  contravention_guid?: string;

  @ApiPropertyOptional({ type: String })
  investigation_party_guid?: string;

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

  @ApiPropertyOptional({ type: () => contravention })
  contravention?: contravention;

  @ApiPropertyOptional({ type: () => investigation_party })
  investigation_party?: investigation_party;
}
