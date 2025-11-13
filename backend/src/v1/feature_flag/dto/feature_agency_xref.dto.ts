import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { FeatureCode } from "../../feature_code/entities/feature_code.entity";

export class FeatureAgencyXrefDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for an feature agency relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  public feature_agency_xref_guid: UUID;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the feature agency cross reference.",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the feature agency cross reference was created.  The timestamp is stored in UTC with no Offset.",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that updated the feature agency cross reference.",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the feature agency cross reference was updated.  The timestamp is stored in UTC with no Offset.",
  })
  update_utc_timestamp: Date;

  @ApiProperty({
    example: "EXPERMFTRS",
    description: "A human readable code used to identify a feature.",
  })
  public feature_code: FeatureCode;

  @ApiProperty({
    example: "COS",
    description: "A human readable code used to identify an agency.",
  })
  public agency_code_ref: string;

  @ApiProperty({
    example: "true",
    description: "A boolean indicating if this is an active feature for the agency",
  })
  public active_ind: boolean;
}
