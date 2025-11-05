import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { AttractantCode } from "../../attractant_code/entities/attractant_code.entity";
import { HwcrComplaint } from "../../hwcr_complaint/entities/hwcr_complaint.entity";

export class AttractantHwcrXrefDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for an attractant hwcr relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  public attractant_hwcr_xref_guid: UUID;

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
    example: "INDCAMP",
    description: "A human readable code used to identify an attractant.",
  })
  public attractant_code: AttractantCode;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "System generated unique key for a hwcr complaint.",
  })
  public hwcr_complaint_guid: HwcrComplaint;

  @ApiProperty({
    example: "true",
    description: "A boolean indicating if this is an active attractant for the HWCR",
  })
  public active_ind: Boolean;
}
