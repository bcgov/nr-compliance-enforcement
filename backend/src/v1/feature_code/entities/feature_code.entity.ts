import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class FeatureCode {
  @ApiProperty({
    example: "EXPERMFTRS",
    description: "The feature code",
  })
  @PrimaryColumn({ length: 10 })
  feature_code: string;

  @ApiProperty({ example: "Experimental Features", description: "The short description of the feature code" })
  @Column({ length: 50 })
  short_description: string;

  @ApiProperty({
    example:
      "Invalid LicenseFeatures that were included as early prototypes or placeholders , may be used to solicit feedback from user groups.",
    description: "The long description of the feature code",
  })
  @Column({ length: 250, nullable: true })
  long_description: string;

  @ApiProperty({ example: "10", description: "The display order of the feature code" })
  @Column()
  display_order: number;

  @ApiProperty({ example: "True", description: "An indicator to determine if the feature code is active" })
  @Column()
  active_ind: boolean;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the feature",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the feature was created",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the feature",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the feature was last updated",
  })
  @Column()
  update_utc_timestamp: Date;

  constructor(feature_code?: string) {
    this.feature_code = feature_code;
  }
}
