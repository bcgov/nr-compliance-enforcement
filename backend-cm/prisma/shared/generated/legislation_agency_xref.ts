import { agency_code } from "./agency_code";
import { legislation } from "./legislation";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class legislation_agency_xref {
  @ApiProperty({ type: String })
  legislation_agency_xref_guid: string;

  @ApiProperty({ type: String })
  legislation_guid: string;

  @ApiProperty({ type: String })
  agency_code: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: () => agency_code })
  agency_code_legislation_agency_xref_agency_codeToagency_code: agency_code;

  @ApiProperty({ type: () => legislation })
  legislation: legislation;
}
