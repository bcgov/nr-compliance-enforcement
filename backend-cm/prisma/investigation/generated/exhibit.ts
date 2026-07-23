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
  exhibit_display_number: string;

  @ApiProperty({ type: String })
  property_type: string;

  @ApiProperty({ type: String })
  description_text: string;

  @ApiPropertyOptional({ type: Number })
  quantity_amount?: number;

  @ApiPropertyOptional({ type: String })
  seized_from_first_name?: string;

  @ApiPropertyOptional({ type: String })
  seized_from_last_name?: string;

  @ApiPropertyOptional({ type: String })
  seized_from_address?: string;

  @ApiPropertyOptional({ type: String })
  seized_from_phone_number?: string;

  @ApiProperty({ type: String })
  collected_by_app_user_guid_ref: string;

  @ApiPropertyOptional({ type: String })
  location_of_intake_text?: string;

  @ApiProperty({ type: String })
  property_tag_number: string;

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

  @ApiProperty({ type: Date })
  collected_utc_date: Date;

  @ApiPropertyOptional({ type: Date })
  collected_utc_time?: Date;

  @ApiProperty({ type: () => investigation })
  investigation: investigation;

  @ApiProperty({ type: () => task })
  task: task;
}
