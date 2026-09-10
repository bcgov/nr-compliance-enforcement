import { enforcement_action } from "./enforcement_action";
import { sanction_status_code } from "./sanction_status_code";
import { sanction_type_code } from "./sanction_type_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class administrative_sanction {
  @ApiProperty({ type: String })
  administrative_sanction_guid: string;

  @ApiProperty({ type: String })
  enforcement_action_guid: string;

  @ApiProperty({ type: String })
  sanction_type_code: string;

  @ApiProperty({ type: Date })
  effective_date: Date;

  @ApiProperty({ type: Date })
  end_date: Date;

  @ApiProperty({ type: String })
  sanction_status_code: string;

  @ApiPropertyOptional({ type: String })
  comment?: string;

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

  @ApiProperty({ type: () => sanction_status_code })
  sanction_status_code_administrative_sanction_sanction_status_codeTosanction_status_code: sanction_status_code;

  @ApiProperty({ type: () => sanction_type_code })
  sanction_type_code_administrative_sanction_sanction_type_codeTosanction_type_code: sanction_type_code;
}
