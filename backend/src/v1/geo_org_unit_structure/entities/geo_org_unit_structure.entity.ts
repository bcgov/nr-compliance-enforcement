import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { GeoOrganizationUnitCode } from "../../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { Entity, Column, JoinColumn, Unique, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
@Unique(["parent_geo_org_unit_code", "child_geo_org_unit_code"])
export class GeoOrgUnitStructure {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The Unique identifier for the Geo Org Unit Structure",
  })
  @PrimaryGeneratedColumn("uuid")
  geo_org_unit_structure_guid: UUID;

  @ApiProperty({ example: "COS", description: "The agency this geo org unit structure references" })
  @JoinColumn({ name: "agency_code_ref" })
  agency_code_ref: string;

  @ApiProperty({ example: "903f87c8-76dd-427c-a1bb-4d179e443252", description: "The parent geo org unit structure" })
  @ManyToOne(() => GeoOrganizationUnitCode, { nullable: true })
  @JoinColumn({ name: "parent_geo_org_unit_code" })
  parent_geo_org_unit_code: GeoOrganizationUnitCode;

  @ApiProperty({ example: "903f87c8-76dd-427c-a1bb-4d179e443252", description: "The child geo org unit structure" })
  @ManyToOne(() => GeoOrganizationUnitCode, { nullable: true })
  @JoinColumn({ name: "child_geo_org_unit_code" })
  child_geo_org_unit_code: GeoOrganizationUnitCode;

  @ApiProperty({ example: "2023-01-22", description: "The effective date for this geo org unit structure" })
  @Column()
  effective_date: Date;

  @ApiProperty({ example: "2023-01-22", description: "The effective date for this geo org unit structure" })
  @Column({ nullable: true })
  expiry_date: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the violation",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the violation was created",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the violation",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the violation was last updated",
  })
  @Column()
  update_utc_timestamp: Date;

  constructor() {}
}
