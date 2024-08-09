import { ApiProperty } from "@nestjs/swagger";

export class FeatureCodeDto {
  @ApiProperty({
    example: "EXPERMFTRS",
    description: "The feature code",
  })
  feature_code: string;

  @ApiProperty({ example: "Experimental Features", description: "The short description of the feature code" })
  short_description: string;

  @ApiProperty({
    example:
      "Invalid LicenseFeatures that were included as early prototypes or placeholders , may be used to solicit feedback from user groups.",
    description: "The long description of the feature code",
  })
  long_description: string;

  @ApiProperty({ example: "10", description: "The display order of the feature code" })
  display_order: number;

  @ApiProperty({ example: "True", description: "An indicator to determine if the feature code is active" })
  active_ind: boolean;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the feature",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the feature was created",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the feature",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the feature was last updated",
  })
  update_utc_timestamp: Date;
}
