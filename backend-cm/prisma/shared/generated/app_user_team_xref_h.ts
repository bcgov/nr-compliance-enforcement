import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class app_user_team_xref_h {
  @ApiProperty({ type: String })
  h_app_user_team_xref_guid: string;

  @ApiProperty({ type: String })
  target_row_id: string;

  @ApiProperty({ type: String })
  operation_type: string;

  @ApiProperty({ type: String })
  operation_user_id: string;

  @ApiProperty({ type: Date })
  operation_executed_at: Date;

  @ApiPropertyOptional({ type: Object })
  data_after_executed_operation?: object;
}
