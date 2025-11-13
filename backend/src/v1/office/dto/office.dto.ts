import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { CreateGeoOrganizationUnitCodeDto } from "../../geo_organization_unit_code/dto/create-geo_organization_unit_code.dto";

export class OfficeDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The guid for this office",
  })
  office_guid: UUID;

  @ApiProperty({
    example: "DCC",
    description: "The geo organization code for the office",
  })
  geo_organization_unit_code: CreateGeoOrganizationUnitCodeDto;

  @ApiProperty({
    example: "COS",
    description: "The agency code for the office",
  })
  agency_code_ref: string;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the office",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the office was created",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the office",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the office was last updated",
  })
  update_utc_timestamp: Date;
}
