import { legislation } from "./legislation";
import { legislation_source } from "./legislation_source";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class legislation_version {
  @ApiProperty({ type: String })
  legislation_version_guid: string;

  @ApiProperty({ type: String })
  legislation_source_guid: string;

  @ApiPropertyOptional({ type: String })
  parent_legislation_version_guid?: string;

  @ApiProperty({ type: Date })
  effective_date: Date;

  @ApiProperty({ type: String })
  import_status: string;

  @ApiPropertyOptional({ type: String })
  source_url?: string;

  @ApiPropertyOptional({ type: Date })
  source_effective_date?: Date;

  @ApiPropertyOptional({ type: Date })
  last_import_timestamp?: Date;

  @ApiPropertyOptional({ type: String })
  last_import_log?: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ isArray: true, type: () => legislation })
  legislation: legislation[];

  @ApiPropertyOptional({ type: () => legislation_version })
  legislation_version?: legislation_version;

  @ApiProperty({ isArray: true, type: () => legislation_version })
  other_legislation_version: legislation_version[];

  @ApiProperty({ type: () => legislation_source })
  legislation_source: legislation_source;
}
