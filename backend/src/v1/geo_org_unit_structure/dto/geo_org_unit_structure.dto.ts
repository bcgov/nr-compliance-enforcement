import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { GeoOrganizationUnitCodeDto } from "../../geo_organization_unit_code/dto/geo_organization_unit_code.dto";

export class GeoOrgUnitStructureDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The Unique identifier for the Geo Org Unit Structure",
  })
  geo_org_unit_structure_guid: UUID;

  @ApiProperty({ example: "COS", description: "The agency this geo org unit structure references" })
  agency_code_ref: string;

  @ApiProperty({ example: "903f87c8-76dd-427c-a1bb-4d179e443252", description: "The parent geo org unit structure" })
  parent_geo_org_unit_code: GeoOrganizationUnitCodeDto;

  @ApiProperty({ example: "903f87c8-76dd-427c-a1bb-4d179e443252", description: "The child geo org unit structure" })
  child_geo_org_unit_code: GeoOrganizationUnitCodeDto;

  @ApiProperty({ example: "2023-01-22", description: "The effective date for this geo org unit structure" })
  effective_date: Date;

  @ApiProperty({ example: "2023-01-22", description: "The effective date for this geo org unit structure" })
  expiry_date: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the violation",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the violation was created",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the violation",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the violation was last updated",
  })
  update_utc_timestamp: Date;
}
