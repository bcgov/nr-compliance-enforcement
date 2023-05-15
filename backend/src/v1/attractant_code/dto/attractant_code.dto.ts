import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { AttractantHwcrXref } from "src/v1/attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";

export class AttractantCodeDto 
{
    @ApiProperty({
        example: "COS",
        description: "The attractant code",
      })
      attractant_code: string;
    
      @ApiProperty({ example: "CO Service", description: "The short description of the attractant code" })
      short_description: string;
    
      @ApiProperty({ example: "Conservation Officer Service", description: "The long description of the attractant code" })
      long_description: string;
    
      @ApiProperty({ example: "1", description: "The display order of the attractant code" })
      display_order: number;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the attractant code is active" })
      active_ind: boolean;

      attractant_hwcr_xref: AttractantHwcrXref[];
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the attractant",
      })
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the attractant",
      })
      create_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the attractant was created",
      })
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the attractant",
      })
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the attractant",
      })
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the attractant was last updated",
      })
      update_timestamp: Date;
}
