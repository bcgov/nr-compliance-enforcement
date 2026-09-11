import { enforcement_action } from "./enforcement_action";
import { ticket_outcome_code } from "./ticket_outcome_code";
import { ticket_type_code } from "./ticket_type_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ticket {
  @ApiProperty({ type: String })
  ticket_guid: string;

  @ApiProperty({ type: String })
  enforcement_action_guid: string;

  @ApiProperty({ type: String })
  ticket_outcome_code: string;

  @ApiProperty({ type: Number })
  ticket_amount: number;

  @ApiProperty({ type: String })
  ticket_number: string;

  @ApiPropertyOptional({ type: Date })
  paid_date?: Date;

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
  ticket_type_code?: string;

  @ApiPropertyOptional({ type: Date })
  appeal_hearing_date?: Date;

  @ApiProperty({ type: () => enforcement_action })
  enforcement_action: enforcement_action;

  @ApiProperty({ type: () => ticket_outcome_code })
  ticket_outcome_code_ticket_ticket_outcome_codeToticket_outcome_code: ticket_outcome_code;

  @ApiPropertyOptional({ type: () => ticket_type_code })
  ticket_type_code_ticket_ticket_type_codeToticket_type_code?: ticket_type_code;
}
