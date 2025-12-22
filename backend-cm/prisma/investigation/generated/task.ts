import { investigation } from "./investigation";
import { task_status_code } from "./task_status_code";
import { task_type_code } from "./task_type_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class task {
  @ApiProperty({ type: String })
  task_guid: string;

  @ApiProperty({ type: String })
  investigation_guid: string;

  @ApiProperty({ type: String })
  task_type_code: string;

  @ApiProperty({ type: String })
  task_status_code: string;

  @ApiProperty({ type: Number })
  task_number: number;

  @ApiProperty({ type: String })
  app_create_user_guid_ref: string;

  @ApiProperty({ type: Date })
  app_create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  app_update_user_guid_ref?: string;

  @ApiPropertyOptional({ type: Date })
  app_update_utc_timestamp?: Date;

  @ApiPropertyOptional({ type: String })
  assigned_app_user_guid_ref?: string;

  @ApiPropertyOptional({ type: String })
  description?: string;

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

  @ApiProperty({ type: () => investigation })
  investigation: investigation;

  @ApiProperty({ type: () => task_status_code })
  task_status_code_task_task_status_codeTotask_status_code: task_status_code;

  @ApiProperty({ type: () => task_type_code })
  task_type_code_task_task_type_codeTotask_type_code: task_type_code;
}
