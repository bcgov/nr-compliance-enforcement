import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { Complaint } from "../../complaint/entities/complaint.entity";
import { Entity, Column, OneToOne, JoinColumn, Unique, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { GirTypeCode } from "../../gir_type_code/entities/gir_type_code.entity";

@Entity()
@Unique(["complaint_identifier"])
export class GirComplaint {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The Unique identifier for the general information complaint",
  })
  @PrimaryGeneratedColumn("uuid")
  gir_complaint_guid: UUID;

  @ApiProperty({ example: "COS-5436", description: "The complaint this allegation references" })
  @OneToOne(() => Complaint)
  @JoinColumn({ name: "complaint_identifier" })
  complaint_identifier: Complaint;

  @ApiProperty({ example: "COCNT", description: "The general information type code for this allegation" })
  @ManyToOne(() => GirTypeCode, { nullable: true })
  @JoinColumn({ name: "gir_type_code" })
  gir_type_code: GirTypeCode;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the general information entry",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the general information entry was created",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the general information entry",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the general information entry was last updated",
  })
  @Column()
  update_utc_timestamp: Date;

  constructor(
    complaint_identifier?: Complaint,
    gir_type_code?: GirTypeCode,
    create_user_id?: string,
    create_utc_timestamp?: Date,
    update_user_id?: string,
    update_utc_timestamp?: Date,
  ) {
    this.complaint_identifier = complaint_identifier;
    this.gir_type_code = gir_type_code;
    this.create_user_id = create_user_id;
    this.create_utc_timestamp = create_utc_timestamp;
    this.update_user_id = update_user_id;
    this.update_utc_timestamp = update_utc_timestamp;
  }
}
