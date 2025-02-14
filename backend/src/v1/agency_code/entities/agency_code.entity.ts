import { ApiProperty } from "@nestjs/swagger";
import { ViolationAgencyXref } from "../../violation_agency_xref/entities/violation_agency_entity_xref";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";

@Entity()
export class AgencyCode {
  @ApiProperty({
    example: "COS",
    description: "The agency code",
  })
  @PrimaryColumn({ length: 10 })
  agency_code: string;

  @ApiProperty({ example: "CO Service", description: "The short description of the agency code" })
  @Column({ length: 50 })
  short_description: string;

  @ApiProperty({ example: "Conservation Officer Service", description: "The long description of the agency code" })
  @Column({ length: 250, nullable: true })
  long_description: string;

  @ApiProperty({ example: "1", description: "The display order of the agency code" })
  @Column()
  display_order: number;

  @ApiProperty({ example: "True", description: "An indicator to determine if the agency code is active" })
  @Column()
  active_ind: boolean;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the agency",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the agency was created",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the agency",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the agency was last updated",
  })
  @Column()
  update_utc_timestamp: Date;

  @OneToMany(() => ViolationAgencyXref, (violationAgencyXref) => violationAgencyXref.agency_code)
  violationAgencyXrefs: ViolationAgencyXref[];

  constructor(agency_code?: string) {
    this.agency_code = agency_code;
  }
}
