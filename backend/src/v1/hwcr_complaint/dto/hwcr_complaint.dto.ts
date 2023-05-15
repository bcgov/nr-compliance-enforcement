import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Complaint } from "../../complaint/entities/complaint.entity";
import { SpeciesCode } from "src/v1/species_code/entities/species_code.entity";
import { HwcrComplaintNatureCode } from "src/v1/hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { AttractantHwcrXref } from "src/v1/attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";

export class HwcrComplaintDto
{
    @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The Unique identifier for the allegation",
      })
      allegation_complaint_guid: UUID;
    
      @ApiProperty({ example: "COS-5436", description: "The complaint this HWCR complaint references" })
      complaint_identifier: Complaint;
    
      @ApiProperty({ example: "INV", description: "The species code for this HWCR complaint" })
      species_code: SpeciesCode;

      @ApiProperty({ example: "INV", description: "The species code for this HWCR complaint" })
      hwcr_complaint_nature_code: HwcrComplaintNatureCode;

      attractant_hwcr_xref: AttractantHwcrXref[];

      @ApiProperty({
        example: "Witnessed individual dumping garbage on crown land",
        description: "The details the witness has reported about this HWCR complaint",
      })
      other_attractants_text: string;
    
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
