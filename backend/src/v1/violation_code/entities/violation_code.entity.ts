import { ApiProperty } from "@nestjs/swagger";
import { ViolationAgencyXref } from "../../violation_agency_xref/entities/violation_agency_entity_xref";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";

@Entity()
export class ViolationCode {
  @ApiProperty({
    example: "IVL",
    description: "The violation code",
  })
  @PrimaryColumn({ length: 10 })
  violation_code: string;

  @ApiProperty({ example: "Invalid License", description: "The short description of the violation code" })
  @Column({ length: 50 })
  short_description: string;

  @ApiProperty({ example: "Invalid License", description: "The long description of the violation code" })
  @Column({ length: 250, nullable: true })
  long_description: string;

  @ApiProperty({ example: "1", description: "The display order of the violation code" })
  @Column()
  display_order: number;

  @ApiProperty({ example: "True", description: "An indicator to determine if the violation code is active" })
  @Column()
  active_ind: boolean;

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

  @OneToMany(() => ViolationAgencyXref, (violationAgencyXref) => violationAgencyXref.violation_code)
  violationAgencyXrefs: ViolationAgencyXref[];

  constructor(violation_code?: string) {
    this.violation_code = violation_code;
  }
}
