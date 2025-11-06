import { geo_organization_unit_code } from "./geo_organization_unit_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class geo_org_unit_type_code {
  @ApiProperty({ type: String })
  geo_org_unit_type_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiProperty({ type: Number })
  display_order: number;

  @ApiProperty({ type: Boolean })
  active_ind: boolean;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiProperty({ type: String })
  update_user_id: string;

  @ApiProperty({ type: Date })
  update_utc_timestamp: Date;

  @ApiProperty({ isArray: true, type: () => geo_organization_unit_code })
  geo_organization_unit_code_geo_organization_unit_code_geo_org_unit_type_codeTogeo_org_unit_type_code: geo_organization_unit_code[];
}
