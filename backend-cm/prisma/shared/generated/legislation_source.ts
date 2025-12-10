import { legislation } from "./legislation";
import { agency_code } from "./agency_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class legislation_source {
  @ApiProperty({ type: String })
  legislation_source_guid: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiProperty({ type: String })
  source_url: string;

  @ApiProperty({ type: String })
  agency_code: string;

  @ApiProperty({ type: Boolean })
  active_ind: boolean = true;

  @ApiProperty({ type: Boolean })
  imported_ind: boolean;

  @ApiPropertyOptional({ type: Date })
  last_import_timestamp?: Date;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiPropertyOptional({ type: String })
  import_status?: string = "PENDING";

  @ApiPropertyOptional({ type: String })
  last_import_log?: string;

  @ApiProperty({ isArray: true, type: () => legislation })
  legislation: legislation[];

  @ApiProperty({ type: () => agency_code })
  agency_code_legislation_source_agency_codeToagency_code: agency_code;
}
