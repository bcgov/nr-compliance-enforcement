import { park_area_xref } from "./park_area_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class park_area {
  @ApiProperty({ type: String })
  park_area_guid: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  region_name?: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ isArray: true, type: () => park_area_xref })
  park_area_xref: park_area_xref[];
}
