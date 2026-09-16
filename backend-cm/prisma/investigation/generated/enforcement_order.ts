import { enforcement_action } from "./enforcement_action";
import { order_status_code } from "./order_status_code";
import { order_type_code } from "./order_type_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class enforcement_order {
  @ApiProperty({ type: String })
  enforcement_order_guid: string;

  @ApiProperty({ type: String })
  enforcement_action_guid: string;

  @ApiPropertyOptional({ type: String })
  order_type_code?: string;

  @ApiPropertyOptional({ type: Boolean })
  remediation_required_ind?: boolean;

  @ApiPropertyOptional({ type: Date })
  appeal_hearing_date?: Date;

  @ApiProperty({ type: String })
  order_status_code: string;

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

  @ApiProperty({ type: () => order_status_code })
  order_status_code_enforcement_order_order_status_codeToorder_status_code: order_status_code;

  @ApiPropertyOptional({ type: () => order_type_code })
  order_type_code_enforcement_order_order_type_codeToorder_type_code?: order_type_code;
}
