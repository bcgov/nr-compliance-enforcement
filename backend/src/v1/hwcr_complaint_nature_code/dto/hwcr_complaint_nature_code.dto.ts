import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";

export class HwcrComplainNatureCodeDto 
{
    @ApiProperty({
        example: "COS",
        description: "The hwcr_complaint_nature code",
      })
      hwcr_complaint_nature_code: string;
    
      @ApiProperty({ example: "CO Service", description: "The short description of the hwcr_complaint_nature code" })
      short_description: string;
    
      @ApiProperty({ example: "Conservation Officer Service", description: "The long description of the hwcr_complaint_nature code" })
      long_description: string;
    
      @ApiProperty({ example: "1", description: "The display order of the hwcr_complaint_nature code" })
      display_order: number;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the hwcr_complaint_nature code is active" })
      active_ind: boolean;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the hwcr_complaint_nature",
      })
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the hwcr_complaint_nature",
      })
      create_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the hwcr_complaint_nature was created",
      })
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the hwcr_complaint_nature",
      })
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the hwcr_complaint_nature",
      })
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the hwcr_complaint_nature was last updated",
      })
      update_timestamp: Date;
}
