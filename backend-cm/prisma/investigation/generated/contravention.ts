import { investigation } from "./investigation";
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
}
