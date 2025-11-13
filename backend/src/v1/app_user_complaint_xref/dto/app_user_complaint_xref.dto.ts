import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { Complaint } from "../../complaint/entities/complaint.entity";
import { AppUserComplaintXrefCode } from "../../app_user_complaint_xref_code/entities/app_user_complaint_xref_code.entity";

export class AppUserComplaintXrefDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for an app user complaint relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  public app_user_complaint_xref_guid: UUID;

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
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The app user GUID",
  })
  public app_user_guid: UUID;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "System generated unique key for a complaint.",
  })
  public complaint_identifier: Complaint;

  @ApiProperty({
    example: "ASSIGNEE",
    description:
      "Code identifying the type of relationship between the app user and complaint (ASSIGNEE, COLLABORATOR, SUSPECT, etc.)",
  })
  public app_user_complaint_xref_code: AppUserComplaintXrefCode;

  @ApiProperty({
    example: "true",
    description: "A boolean indicator to determine if the app user complaint relationship is active.",
  })
  public active_ind: boolean;
}
