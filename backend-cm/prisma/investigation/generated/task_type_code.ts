import { task } from "./task";
import { task_sub_type_code } from "./task_sub_type_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class task_type_code {
  @ApiProperty({ type: String })
  task_type_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiPropertyOptional({ type: Number })
  display_order?: number;

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

  @ApiProperty({ isArray: true, type: () => task })
  task_task_task_type_codeTotask_type_code: task[];

  @ApiProperty({ isArray: true, type: () => task_sub_type_code })
  task_sub_type_code_task_sub_type_code_task_type_codeTotask_type_code: task_sub_type_code[];
}
