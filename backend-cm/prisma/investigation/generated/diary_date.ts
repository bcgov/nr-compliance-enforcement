import { investigation } from "./investigation";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class diary_date {
  @ApiProperty({ type: String })
  diary_date_guid: string;

  @ApiProperty({ type: String })
  investigation_guid: string;

  @ApiProperty({ type: Date })
  due_date: Date;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Date })
  added_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  added_user_guid?: string;

  @ApiPropertyOptional({ type: Date })
  updated_utc_timestamp?: Date;

  @ApiPropertyOptional({ type: String })
  updated_user_guid?: string;

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
}
