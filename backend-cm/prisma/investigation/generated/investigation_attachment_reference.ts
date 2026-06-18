import { investigation_party } from "./investigation_party";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation_attachment_reference {
  @ApiProperty({ type: String })
  investigation_attachment_reference_guid: string;

  @ApiProperty({ type: String })
  investigation_party_guid: string;

  @ApiProperty({ type: String })
  object_guid_ref: string;

  @ApiProperty({ type: String })
  s3_version_ref: string;

  @ApiProperty({ type: Boolean })
  active_ind: boolean = true;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: () => investigation_party })
  investigation_party: investigation_party;
}
