import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";

import { ComplaintMethodReceivedCode } from "../../complaint_method_received_code/entities/complaint_method_received_code.entity";

export class CompMthdRecvCdAgcyCdXrefDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for an attractant hwcr relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  public comp_mthd_recv_cd_agcy_cd_xref_guid: UUID;

  @ApiProperty({
    example: "INDCAMP",
    description: "A human readable code used to identify an attractant.",
  })
  public agency_code_ref: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "System generated unique key for a hwcr complaint.",
  })
  public complaint_method_received_code: ComplaintMethodReceivedCode;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the attractant hwcr cross reference.",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the attractant hwcr cross reference was created.  The timestamp is stored in UTC with no Offset.",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that updated the attractant hwcr cross reference.",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the attractant hwcr cross reference was updated.  The timestamp is stored in UTC with no Offset.",
  })
  update_utc_timestamp: Date;

  @ApiProperty({
    example: "true",
    description: "A boolean indicating if this is an active attractant for the HWCR",
  })
  public active_ind: boolean;
}
