import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EmailReference {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for an feature hwcr relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  @PrimaryGeneratedColumn()
  public email_reference_guid: UUID;

  @ApiProperty({
    example: "example@gov.bc.ca",
    description: "The email address used by parties referenced by this record.",
  })
  @Column({ length: 256 })
  public email_address: string;

  @ApiProperty({
    example: "COS",
    description: "System generated unique key for a agency.",
  })
  @Column()
  public agency_code_ref: string;

  @ApiProperty({
    example: "STHPCE",
    description: "The geographic organization code that the email address belongs to.",
  })
  @Column()
  public geo_organization_unit_code: string;

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

  @ApiProperty({
    example: "true",
    description: "A boolean indicating if this is an active feature for agency",
  })
  @Column()
  public active_ind: boolean;
}
