import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { ComplaintDto } from "../../complaint/dto/complaint.dto";
import { ViolationCodeDto } from "../../violation_code/dto/violation_code.dto";

export class AllegationComplaintDto
{
    @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The Unique identifier for the allegation",
      })
      allegation_complaint_guid: UUID;
    
      @ApiProperty({ example: "COS-231", description: "The complaint this allegation references" })
      complaint_identifier: ComplaintDto;
    
      @ApiProperty({ example: "INV", description: "The violation code for this allegation" })
      violation_code: ViolationCodeDto;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the allegation is in progress" })
      in_progress_ind: boolean;

      @ApiProperty({ example: "True", description: "An indicator to show if the allegation was observed" })
      observed_ind: boolean;

      @ApiProperty({
        example: "Witnessed individual dumping garbage on crown land",
        description: "The details the witness has reported about this allegation",
      })
      suspect_witnesss_dtl_text: string;
    
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
}
