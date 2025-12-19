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
  app_create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  app_create_user_guid_ref?: string;

  @ApiPropertyOptional({ type: Date })
  app_update_utc_timestamp?: Date;

  @ApiPropertyOptional({ type: String })
  app_update_user_guid_ref?: string;

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
