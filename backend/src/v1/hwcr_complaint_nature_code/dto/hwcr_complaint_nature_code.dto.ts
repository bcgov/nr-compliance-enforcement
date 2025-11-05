import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";

export class HwcrComplainNatureCodeDto {
  @ApiProperty({
    example: "HUMINJ",
    description: "A human readable code used to identify the nature of the Human Wildlife Conflict.",
  })
  hwcr_complaint_nature_code: string;

  @ApiProperty({
    example: "Human injury/death",
    description: "The short description of the nature of the Human Wildlife Conflict code.",
  })
  short_description: string;

  @ApiProperty({
    example: "Human injury/death",
    description: "The long description of the nature of the Human Wildlife Conflict code.",
  })
  long_description: string;

  @ApiProperty({
    example: "1",
    description:
      "The order in which the values of the nature of the Human Wildlife Conflict code table should be displayed when presented to a user in a list.",
  })
  display_order: number;

  @ApiProperty({
    example: "True",
    description: "A boolean indicator to determine if the nature of the Human Wildlife Conflict code is active.",
  })
  active_ind: boolean;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the human wildlife conflict nature code.",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the human wildlife conflict nature code was created.  The timestamp is stored in UTC with no Offset.",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that updated the human wildlife conflict nature code.",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the human wildlife conflict nature code was updated.  The timestamp is stored in UTC with no Offset.",
  })
  update_utc_timestamp: Date;
}
