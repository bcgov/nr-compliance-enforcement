import { activity_note } from "./activity_note";
import { diary_date } from "./diary_date";
import { exhibit } from "./exhibit";
import { investigation } from "./investigation";
import { task_category_type_code } from "./task_category_type_code";
import { task_status_code } from "./task_status_code";
import { task_type_code } from "./task_type_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class task {
  @ApiProperty({ type: String })
  task_guid: string;

  @ApiProperty({ type: String })
  investigation_guid: string;

  @ApiPropertyOptional({ type: String })
  task_type_code?: string;

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

  @ApiProperty({ type: String })
  task_category_type_code: string;

  @ApiProperty({ type: String })
  remarks: string;

  @ApiProperty({ type: Date })
  due_date: Date;

  @ApiProperty({ isArray: true, type: () => activity_note })
  activity_note: activity_note[];

  @ApiProperty({ isArray: true, type: () => diary_date })
  diary_date: diary_date[];

  @ApiProperty({ isArray: true, type: () => exhibit })
  exhibit: exhibit[];

  @ApiProperty({ type: () => investigation })
  investigation: investigation;

  @ApiProperty({ type: () => task_category_type_code })
  task_category_type_code_task_task_category_type_codeTotask_category_type_code: task_category_type_code;

  @ApiProperty({ type: () => task_status_code })
  task_status_code_task_task_status_codeTotask_status_code: task_status_code;

  @ApiPropertyOptional({ type: () => task_type_code })
  task_type_code_task_task_type_codeTotask_type_code?: task_type_code;
}
