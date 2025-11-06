import { geo_org_unit_structure } from "./geo_org_unit_structure";
import { geo_org_unit_type_code } from "./geo_org_unit_type_code";
import { office } from "./office";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class geo_organization_unit_code {
  @ApiProperty({ type: String })
  geo_organization_unit_code: string;

  @ApiPropertyOptional({ type: String })
  short_description?: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

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
  geo_org_unit_type_code?: string;

  @ApiProperty({ type: Boolean })
  administrative_office_ind: boolean;

  @ApiProperty({ isArray: true, type: () => geo_org_unit_structure })
  geo_org_unit_structure_geo_org_unit_structure_child_geo_org_unit_codeTogeo_organization_unit_code: geo_org_unit_structure[];

  @ApiProperty({ isArray: true, type: () => geo_org_unit_structure })
  geo_org_unit_structure_geo_org_unit_structure_parent_geo_org_unit_codeTogeo_organization_unit_code: geo_org_unit_structure[];

  @ApiPropertyOptional({ type: () => geo_org_unit_type_code })
  geo_org_unit_type_code_geo_organization_unit_code_geo_org_unit_type_codeTogeo_org_unit_type_code?: geo_org_unit_type_code;

  @ApiProperty({ isArray: true, type: () => office })
  office_office_geo_organization_unit_codeTogeo_organization_unit_code: office[];
}
