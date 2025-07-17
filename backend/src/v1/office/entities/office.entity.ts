import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Entity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { CosGeoOrgUnit } from "../../cos_geo_org_unit/entities/cos_geo_org_unit.entity";
import { Officer } from "../../officer/entities/officer.entity";

@Entity()
export class Office {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The guid for this office",
  })
  @PrimaryGeneratedColumn("uuid")
  office_guid: UUID;

  @ApiProperty({
    example: "DCC",
    description: "The geographical organization code of the organization that currently owns the complaint",
  })
  @OneToOne(() => CosGeoOrgUnit)
  @JoinColumn({ name: "geo_organization_unit_code", referencedColumnName: "office_location_code" })
  @Column({ name: "geo_organization_unit_code" })
  cos_geo_org_unit: CosGeoOrgUnit;

  @ApiProperty({
    example: "COS",
    description: "The agency code for the office",
  })
  @Column({ name: "agency_code_ref" })
  agency_code_ref: string;

  @ApiProperty({
    example: "DCC",
    description: "The office for this officer",
  })
  @OneToMany(() => Officer, (officer) => officer.office_guid)
  officers: Officer[];

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the office",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the office was created",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the office",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the office was last updated",
  })
  @Column()
  update_utc_timestamp: Date;

  constructor() {}
}
