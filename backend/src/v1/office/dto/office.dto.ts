import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { AgencyCodeDto } from "src/v1/agency_code/dto/agency_code.dto";
import { CreateGeoOrganizationUnitCodeDto } from "src/v1/geo_organization_unit_code/dto/create-geo_organization_unit_code.dto";

export class OfficeDto
{
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
      agency_code: AgencyCodeDto;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the office",
      })
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the office",
      })
      create_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the office was created",
      })
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the office",
      })
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the office",
      })
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the office was last updated",
      })
      update_timestamp: Date;
}
