import { ApiProperty } from "@nestjs/swagger";

export class AppUserComplaintXrefCodeDto {
  @ApiProperty({
    example: "ASSIGNEE",
    description: "A human readable code used to identify a relationship type between a person and a complaint.",
  })
  person_complaint_xref_code: string;

  @ApiProperty({
    example: "Assignee",
    description: "The short description of the relationship type between a person and a complaint.",
  })
  short_description: string;

  @ApiProperty({
    example: "Assignee",
    description: "The long description of the relationship type between a person and a complaint.",
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
    example: "mburns",
    description: "The id of the user that created the code.",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the code was created.  The timestamp is stored in UTC with no Offset.",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "mburns",
    description: "The id of the user that updated the code.",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the code was updated.  The timestamp is stored in UTC with no Offset.",
  })
  update_utc_timestamp: Date;
}
