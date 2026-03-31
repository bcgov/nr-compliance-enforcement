import { investigation } from "./investigation";
import { task } from "./task";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class exhibit {
  @ApiProperty({ type: String })
  exhibit_guid: string;

  @ApiProperty({ type: String })
  task_guid: string;

  @ApiProperty({ type: String })
  investigation_guid: string;

  @ApiProperty({ type: Number })
  exhibit_number: number;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Date })
  date_collected: Date;

  @ApiProperty({ type: String })
  collected_user_guid_ref: string;

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

  @ApiProperty({ type: () => task })
  task: task;
}
