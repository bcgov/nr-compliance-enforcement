import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { GeoOrgUnitTypeCodeDto } from "../../geo_org_unit_type_code/dto/geo_org_unit_type_code.dto";

export class GeoOrganizationUnitCodeDto {
  @ApiProperty({
    example: "DCC",
    description: "The geo organization unit code",
  })
  geo_organization_unit_code: string;

  @ApiProperty({
    example: "Open",
    description: "The geo org unit type code",
  })
  geo_org_unit_type_code: GeoOrgUnitTypeCodeDto;

  @ApiProperty({ example: "Caribou", description: "The short description of the geo organization unit code" })
  short_description: string;

  @ApiProperty({ example: "Caribou", description: "The long description of the geo organization unit code" })
  long_description: string;

  @ApiProperty({ example: "DKM", description: "The legacy code of the geo organization unit code" })
  legacy_code: string;

  @ApiProperty({ example: "2023-01-22", description: "The effective date for this geo org unit structure" })
  effective_date: Date;

  @ApiProperty({ example: "2023-01-22", description: "The effective date for this geo org unit structure" })
  expiry_date: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the geo organization unit",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the geo organization unit was created",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the geo organization unit",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the geo organization unit was last updated",
  })
  update_utc_timestamp: Date;
}
