import { app_user } from "./app_user";
import { case_file } from "./case_file";
import { geo_org_unit_structure } from "./geo_org_unit_structure";
import { office } from "./office";
import { team } from "./team";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class agency_code {
  @ApiProperty({ type: String })
  agency_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiPropertyOptional({ type: Number })
  display_order?: number;

  @ApiProperty({ type: Boolean })
  active_ind: boolean = true;

  @ApiProperty({ type: Boolean })
  external_agency_ind: boolean;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ isArray: true, type: () => app_user })
  app_user: app_user[];

  @ApiProperty({ isArray: true, type: () => case_file })
  case_file: case_file[];

  @ApiProperty({ isArray: true, type: () => geo_org_unit_structure })
  geo_org_unit_structure: geo_org_unit_structure[];

  @ApiProperty({ isArray: true, type: () => office })
  office: office[];

  @ApiProperty({ isArray: true, type: () => team })
  team: team[];
}
