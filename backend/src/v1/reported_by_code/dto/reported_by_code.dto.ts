import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";

export class ReportedByCodeDto 
{
    @ApiProperty({
        example: "COS",
        description: "The reported by code",
      })
      reported_by_code: string;
    
      @ApiProperty({ example: "CO Service", description: "The short description of the reported by code" })
      short_description: string;
    
      @ApiProperty({ example: "Conservation Officer Service", description: "The long description of the reported by code" })
      long_description: string;
    
      @ApiProperty({ example: "1", description: "The display order of the reported by code" })
      display_order: number;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the reported by code is active" })
      active_ind: boolean;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the reported by code",
      })
      create_user_id: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the reported by code was created",
      })
      create_utc_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the reported by code",
      })
      update_user_id: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the reported by code was last updated",
      })
      update_utc_timestamp: Date;
}
