import { app_user } from "./app_user";
import { agency_code } from "./agency_code";
import { geo_organization_unit_code } from "./geo_organization_unit_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class office {
  @ApiProperty({ type: String })
  office_guid: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiProperty({ type: String })
  update_user_id: string;

  @ApiProperty({ type: Date })
  update_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  geo_organization_unit_code?: string;

  @ApiPropertyOptional({ type: String })
  agency_code_ref?: string;

  @ApiProperty({ isArray: true, type: () => app_user })
  app_user: app_user[];

  @ApiPropertyOptional({ type: () => agency_code })
  agency_code?: agency_code;

  @ApiPropertyOptional({ type: () => geo_organization_unit_code })
  geo_organization_unit_code_office_geo_organization_unit_codeTogeo_organization_unit_code?: geo_organization_unit_code;
}
