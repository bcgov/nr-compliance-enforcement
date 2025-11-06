import { agency_code } from "./agency_code";
import { geo_organization_unit_code } from "./geo_organization_unit_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class geo_org_unit_structure {
  @ApiProperty({ type: String })
  geo_org_unit_structure_guid: string;

  @ApiProperty({ type: Date })
  effective_date: Date;

  @ApiPropertyOptional({ type: Date })
  expiry_date?: Date;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiProperty({ type: String })
  update_user_id: string;

  @ApiProperty({ type: Date })
  update_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  agency_code_ref?: string;

  @ApiPropertyOptional({ type: String })
  parent_geo_org_unit_code?: string;

  @ApiPropertyOptional({ type: String })
  child_geo_org_unit_code?: string;

  @ApiPropertyOptional({ type: () => agency_code })
  agency_code?: agency_code;

  @ApiPropertyOptional({ type: () => geo_organization_unit_code })
  geo_organization_unit_code_geo_org_unit_structure_child_geo_org_unit_codeTogeo_organization_unit_code?: geo_organization_unit_code;

  @ApiPropertyOptional({ type: () => geo_organization_unit_code })
  geo_organization_unit_code_geo_org_unit_structure_parent_geo_org_unit_codeTogeo_organization_unit_code?: geo_organization_unit_code;
}
