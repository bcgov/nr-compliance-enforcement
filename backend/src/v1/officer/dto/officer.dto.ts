import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { OfficeDto } from "src/v1/office/dto/office.dto";
import { PersonDto } from "src/v1/person/dto/person.dto";

export class OfficerDto 
{
    @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The guid for this officer",
      })
      officer_guid: UUID;

      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The person for this officer",
      })
      person_guid: PersonDto;

      @ApiProperty({
        example: "DCC",
        description: "The office for this officer",
      })
      office_guid: OfficeDto;
      
      @ApiProperty({
        example: "Charles",
        description: "The user id of this officer",
      })
      user_id: string;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the officer",
      })
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the officer",
      })
      create_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the officer was created",
      })
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the officer",
      })
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the officer",
      })
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the officer was last updated",
      })
      update_timestamp: Date;

}
