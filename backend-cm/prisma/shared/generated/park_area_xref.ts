import { park_area } from "./park_area";
import { park } from "./park";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class park_area_xref {
  @ApiProperty({ type: String })
  park_area_guid_xref: string;

  @ApiProperty({ type: String })
  park_area_guid: string;

  @ApiProperty({ type: String })
  park_guid: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: () => park_area })
  park_area: park_area;

  @ApiProperty({ type: () => park })
  park: park;
}
