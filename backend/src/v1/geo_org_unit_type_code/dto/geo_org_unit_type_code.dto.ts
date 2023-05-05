import { ApiProperty } from "@nestjs/swagger";

export class GeoOrgUnitTypeCodeDto
{
    @ApiProperty({
        example: "D",
        description: "The geo org unit type code",
      })
      geo_org_unit_type_code: string;
    
      @ApiProperty({ example: "District", description: "The short description of the geo org unit type code" })
      short_description: string;
    
      @ApiProperty({ example: "District", description: "The long description of the geo org unit type code" })
      long_description: string;
    
      @ApiProperty({ example: "1", description: "The display order of the geo org unit type code" })
      display_order: number;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the geo org unit type code is active" })
      active_ind: boolean;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the geo org unit type",
      })
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the geo org unit type",
      })
      create_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the geo org unit type was created",
      })
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the geo org unit type",
      })
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the geo org unit type",
      })
      update_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the geo org unit type was last updated",
      })
      update_timestamp: Date;
    
      constructor() {
    
      }
}
