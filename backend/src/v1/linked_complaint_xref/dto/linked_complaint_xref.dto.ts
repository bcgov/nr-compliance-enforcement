import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { Complaint } from "../../complaint/entities/complaint.entity";

export class LinkedComplaintXrefDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for a linked complaint relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  public linked_complaint_xref_guid: UUID;

  @ApiProperty({
    example: "mburns",
    description: "The id of the user that created the cross reference.",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the cross reference was created.  The timestamp is stored in UTC with no Offset.",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "mburns",
    description: "The id of the user that updated the cross reference.",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the cross reference was updated.  The timestamp is stored in UTC with no Offset.",
  })
  update_utc_timestamp: Date;

  @ApiProperty({
    example: "24-007007",
    description: "System generated unique key for a complaint.",
  })
  public linked_complaint_identifier: Complaint;

  @ApiProperty({
    example: "23-007007",
    description: "System generated unique key for a complaint.",
  })
  public complaint_identifier: Complaint;

  @ApiProperty({
    example: "True",
    description: "A boolean indicator to determine if the linked complaint is active.",
  })
  public active_ind: boolean;

  @ApiProperty({
    example: "DUPLICATE",
    description: "The type of link between complaints. For example: DUPLICATE or LINK",
  })
  public link_type: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The app user who created the link between complaints",
  })
  public app_user_guid: UUID;
}
