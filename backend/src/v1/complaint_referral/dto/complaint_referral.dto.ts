import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Complaint } from "../../complaint/entities/complaint.entity";
import { AgencyCode } from "../../agency_code/entities/agency_code.entity";
import { Officer } from "../../officer/entities/officer.entity";

export class ComplaintReferralDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for a linked complaint relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  public complaint_referral_guid: UUID;

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
    example: "True",
    description: "A boolean indicator to determine if the linked complaint is active.",
  })
  public active_ind: boolean;

  @ApiProperty({
    example: "23-007007",
    description: "System generated unique key for a hwcr complaint.",
  })
  public complaint_identifier: Complaint;

  @ApiProperty({
    example: "COS",
    description: "",
  })
  public referred_by_agency_code: AgencyCode;

  @ApiProperty({
    example: "COS",
    description: "",
  })
  public referred_to_agency_code: AgencyCode;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "",
  })
  public officer_guid: Officer;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the cross reference was created.  The timestamp is stored in UTC with no Offset.",
  })
  public referral_date: Date;

  @ApiProperty({
    example: "",
    description: "",
  })
  public referral_reason: string;
}
