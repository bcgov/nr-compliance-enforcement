import { agency_code } from "./agency_code";
import { legislation_version } from "./legislation_version";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class legislation_source {
  @ApiProperty({ type: String })
  legislation_source_guid: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiPropertyOptional({ type: String })
  source_url?: string;

  @ApiProperty({ type: String })
  agency_code: string;

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

  @ApiPropertyOptional({ type: String })
  regulations_source_url?: string;

  @ApiProperty({ type: String })
  source_type: string = "BCLAWS";

  @ApiPropertyOptional({ type: String })
  parent_legislation_source_guid?: string;

  @ApiPropertyOptional({ type: String })
  external_key?: string;

  @ApiProperty({ type: () => agency_code })
  agency_code_legislation_source_agency_codeToagency_code: agency_code;

  @ApiPropertyOptional({ type: () => legislation_source })
  legislation_source?: legislation_source;

  @ApiProperty({ isArray: true, type: () => legislation_source })
  other_legislation_source: legislation_source[];

  @ApiProperty({ isArray: true, type: () => legislation_version })
  legislation_version: legislation_version[];
}
