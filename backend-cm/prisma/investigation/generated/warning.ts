import { enforcement_action } from "./enforcement_action";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class warning {
  @ApiProperty({ type: String })
  warning_guid: string;

  @ApiProperty({ type: String })
  enforcement_action_guid: string;

  @ApiProperty({ type: String })
  warning_number: string;

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

  @ApiProperty({ type: () => enforcement_action })
  enforcement_action: enforcement_action;
}
