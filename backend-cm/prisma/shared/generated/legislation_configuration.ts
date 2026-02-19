import { agency_code } from "./agency_code";
import { legislation } from "./legislation";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class legislation_configuration {
  @ApiProperty({ type: String })
  legislation_configuration_guid: string;

  @ApiProperty({ type: String })
  legislation_guid: string;

  @ApiProperty({ type: String })
  agency_code: string;

  @ApiProperty({ type: Boolean })
  enabled_ind: boolean = true;

  @ApiPropertyOptional({ type: String })
  override_text?: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: () => agency_code })
  agency_code_legislation_configuration_agency_codeToagency_code: agency_code;

  @ApiProperty({ type: () => legislation })
  legislation: legislation;
}
