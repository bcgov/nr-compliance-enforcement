import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { Complaint } from "../../complaint/entities/complaint.entity";
import { ViolationCode } from "../../violation_code/entities/violation_code.entity";
import { Entity, Column, OneToOne, JoinColumn, Unique, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
@Unique(["complaint_identifier"])
export class AllegationComplaint {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The Unique identifier for the allegation",
  })
  @PrimaryGeneratedColumn("uuid")
  allegation_complaint_guid: UUID;

  @ApiProperty({ example: "COS-5436", description: "The complaint this allegation references" })
  @OneToOne(() => Complaint)
  @JoinColumn({ name: "complaint_identifier" })
  complaint_identifier: Complaint;

  @ApiProperty({ example: "INV", description: "The violation code for this allegation" })
  @ManyToOne(() => ViolationCode, { nullable: true })
  @JoinColumn({ name: "violation_code" })
  violation_code: ViolationCode;

  @ApiProperty({ example: "True", description: "An indicator to determine if the allegation is in progress" })
  @Column()
  in_progress_ind: boolean;

  @ApiProperty({ example: "True", description: "An indicator to show if the allegation was observed" })
  @Column()
  observed_ind: boolean;

  @ApiProperty({
    example: "Witnessed individual dumping garbage on crown land",
    description: "The details the witness has reported about this allegation",
  })
  @Column({ nullable: true })
  suspect_witnesss_dtl_text: string;

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

  constructor(
    complaint_identifier?: Complaint,
    violation_code?: ViolationCode,
    in_progress_ind?: boolean,
    observed_ind?: boolean,
    suspect_witnesss_dtl_text?: string,
    create_user_id?: string,
    create_utc_timestamp?: Date,
    update_user_id?: string,
    update_utc_timestamp?: Date,
  ) {
    this.complaint_identifier = complaint_identifier;
    this.violation_code = violation_code;
    this.in_progress_ind = in_progress_ind;
    this.observed_ind = observed_ind;
    this.suspect_witnesss_dtl_text = suspect_witnesss_dtl_text;
    this.create_user_id = create_user_id;
    this.create_utc_timestamp = create_utc_timestamp;
    this.update_user_id = update_user_id;
    this.update_utc_timestamp = update_utc_timestamp;
  }
}
