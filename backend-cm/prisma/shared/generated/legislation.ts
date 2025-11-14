import { legislation_type_code } from "./legislation_type_code";
import { legislation_agency_xref } from "./legislation_agency_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class legislation {
  @ApiProperty({ type: String })
  legislation_guid: string;

  @ApiProperty({ type: String })
  legislation_type_code: string;

  @ApiPropertyOptional({ type: String })
  parent_legislation_guid?: string;

  @ApiPropertyOptional({ type: String })
  citation?: string;

  @ApiPropertyOptional({ type: String })
  full_citation?: string;

  @ApiPropertyOptional({ type: String })
  section_title?: string;

  @ApiPropertyOptional({ type: String })
  legislation_text?: string;

  @ApiPropertyOptional({ type: String })
  alternate_text?: string;

  @ApiProperty({ type: Number })
  display_order: number;

  @ApiPropertyOptional({ type: Date })
  effective_date?: Date;

  @ApiPropertyOptional({ type: Date })
  expiry_date?: Date;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: () => legislation_type_code })
  legislation_type_code_legislation_legislation_type_codeTolegislation_type_code: legislation_type_code;

  @ApiPropertyOptional({ type: () => legislation })
  legislation?: legislation;

  @ApiProperty({ isArray: true, type: () => legislation })
  other_legislation: legislation[];

  @ApiProperty({ isArray: true, type: () => legislation_agency_xref })
  legislation_agency_xref: legislation_agency_xref[];
}
