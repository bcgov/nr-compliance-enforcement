import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FeatureCode } from "../../feature_code/entities/feature_code.entity";
import { AgencyCode } from "../../agency_code/entities/agency_code.entity";

@Entity()
export class FeatureAgencyXref {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for an feature hwcr relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  @PrimaryGeneratedColumn()
  public feature_agency_xref_guid: UUID;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the feature hwcr cross reference.",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the feature hwcr cross reference was created.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that updated the feature hwcr cross reference.",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the feature hwcr cross reference was updated.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  update_utc_timestamp: Date;

  @ManyToOne(() => FeatureCode, (feature_code) => feature_code.feature_code)
  @JoinColumn({ name: "feature_code" })
  @ApiProperty({
    example: "EXPERMFTRS",
    description: "A human readable code used to identify a feature.",
  })
  public feature_code: FeatureCode;

  @ManyToOne(() => AgencyCode, (agency_code) => agency_code.agency_code)
  @JoinColumn({ name: "agency_code" })
  @ApiProperty({
    example: "COS",
    description: "System generated unique key for a agency.",
  })
  public agency_code: AgencyCode;

  @ApiProperty({
    example: "true",
    description: "A boolean indicating if this is an active feature for agency",
  })
  @Column()
  public active_ind: boolean;
}
