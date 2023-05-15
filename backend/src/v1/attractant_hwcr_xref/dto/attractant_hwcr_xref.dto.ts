import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { AttractantCode } from "../../attractant_code/entities/attractant_code.entity";
import { HwcrComplaint } from "../../hwcr_complaint/entities/hwcr_complaint.entity";

export class AttractantHwcrXrefDto
{
    public attractant_hwcr_xref_guid: UUID

        @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the violation",
      })
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the violation",
      })
      create_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the violation was created",
      })
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the violation",
      })
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the violation",
      })
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the violation was last updated",
      })
      update_timestamp: Date;

    public attractant_code: AttractantCode

    public hwcr_complaint: HwcrComplaint
}