import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Person } from "../../person/entities/person.entity";
import { Complaint } from "../../complaint/entities/complaint.entity";
import { PersonComplaintXrefCode } from "../../person_complaint_xref_code/entities/person_complaint_xref_code.entity";

export class PersonComplaintXrefDto
{
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "System generated unique key for a person complaint relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  public person_complaint_xref_guid: UUID

  @ApiProperty({
    example: "mburns",
    description: "The id of the user that created the cross reference.",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the cross reference was created.  The timestamp is stored in UTC with no Offset.",
  })
  create_timestamp: Date;

  @ApiProperty({
    example: "mburns",
    description: "The id of the user that updated the cross reference.",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the cross reference was updated.  The timestamp is stored in UTC with no Offset.",
  })
  update_timestamp: Date;

  @ApiProperty({
    example: "MBURNS",
    description: "System generated unique key for an person. .",
  })
  public person: Person;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "System generated unique key for a hwcr complaint.",
  })
  public complaint_identifier: Complaint;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "A human readable code used to identify a relationship type between a person and a complaint.",
  })
  public person_complaint_xref_code: PersonComplaintXrefCode;

  @ApiProperty({ example: "True", description: "A boolean indicator to determine if the person and a complaint is active." })
  public active_ind: boolean;
}