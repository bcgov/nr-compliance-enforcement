import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";

export class ComplaintReferralEmailLogDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique identifier for the complaint referral email log. This key should never be exposed to users via any system utilizing the tables.",
  })
  public complaint_referral_email_log_guid: UUID;

  @ApiProperty({
    example: "d705b9db-0e49-4e5b-9783-b49849fd28f3",
    description: "The unique identifier for the complaint referral associated with this email log.",
  })
  public complaint_referral_guid: UUID;

  @ApiProperty({
    example: "example@example.com",
    description: "The email address the referral email was sent to.",
  })
  public email_address: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the referral email was sent. The timestamp is stored in UTC with no Offset.",
  })
  public email_sent_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the email log record.",
  })
  public create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the email log record was created. The timestamp is stored in UTC with no Offset.",
  })
  public create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the email log record.",
  })
  public update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the email log record was last updated. The timestamp is stored in UTC with no Offset.",
  })
  public update_utc_timestamp: Date;
}
