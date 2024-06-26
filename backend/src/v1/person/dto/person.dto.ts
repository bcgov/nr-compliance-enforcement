import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";

export class PersonDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The guid for this person",
  })
  person_guid: UUID;

  @ApiProperty({
    example: "Charles",
    description: "The first name of this person",
  })
  first_name: string;

  @ApiProperty({
    example: "Montgumry",
    description: "The first middle name of this person",
  })
  middle_name_1: string;

  @ApiProperty({
    example: "Patrick",
    description: "The second middle name of this person",
  })
  middle_name_2: string;

  @ApiProperty({
    example: "Burns",
    description: "The last name of this person",
  })
  last_name: string;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the person",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the person was created",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the person",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the person was last updated",
  })
  update_utc_timestamp: Date;
}
