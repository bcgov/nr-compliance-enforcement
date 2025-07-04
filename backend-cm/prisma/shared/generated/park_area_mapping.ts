import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class park_area_mapping {
  @ApiProperty({ type: String })
  park_area_mapping_guid: string;

  @ApiProperty({ type: String })
  park_area_guid: string;

  @ApiProperty({ type: String })
  external_id: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;
}
