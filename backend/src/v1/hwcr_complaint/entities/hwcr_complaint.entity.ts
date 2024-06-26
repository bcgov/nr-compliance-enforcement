import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Complaint } from "../../complaint/entities/complaint.entity";
import { Entity, Column, OneToOne, JoinColumn, Unique, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { SpeciesCode } from "../../species_code/entities/species_code.entity";
import { HwcrComplaintNatureCode } from "../../hwcr_complaint_nature_code/entities/hwcr_complaint_nature_code.entity";
import { AttractantHwcrXref } from "../../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";

@Entity()
@Unique(["complaint_identifier"])
export class HwcrComplaint {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for a hwcr complaint. This key should never be exposed to users via any system utilizing the tables.",
  })
  @PrimaryGeneratedColumn("uuid")
  hwcr_complaint_guid: UUID;

  @ApiProperty({
    example: "COS-5436",
    description: "Natural key for a complaint generated by webEOC.",
  })
  @OneToOne(() => Complaint)
  @JoinColumn({ name: "complaint_identifier" })
  complaint_identifier: Complaint;

  @ApiProperty({
    example: "BOBCAT",
    description: "A human readable code used to identify a wildlife species.",
  })
  @ManyToOne(() => SpeciesCode)
  @JoinColumn({ name: "species_code" })
  species_code: SpeciesCode;

  @ApiProperty({
    example: "HUMINJ",
    description: "A human readable code used to identify the nature of the Human Wildlife Conflict.",
  })
  @ManyToOne(() => HwcrComplaintNatureCode, { nullable: true })
  @JoinColumn({ name: "hwcr_complaint_nature_code" })
  hwcr_complaint_nature_code: HwcrComplaintNatureCode;

  @OneToMany(() => AttractantHwcrXref, (attractant_hwcr_xref) => attractant_hwcr_xref.hwcr_complaint_guid)
  @JoinColumn({ name: "hwcr_complaint_guid" })
  attractant_hwcr_xref: AttractantHwcrXref[];

  @ApiProperty({
    example: "Witnessed individual dumping garbage on crown land",
    description: 'Provides a more detailed description when the attractant of type "OTHER" is included.',
  })
  @Column({ length: 4000, nullable: true })
  other_attractants_text: string;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the HWCR complaint.",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the HWCR complaint was created.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that updated the HWCR complaint.",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the HWCR complaint was updated.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  update_utc_timestamp: Date;

  constructor(
    complaint_identifier?: Complaint,
    species_code?: SpeciesCode,
    hwcr_complaint_nature_code?: HwcrComplaintNatureCode,
    attractant_hwcr_xref?: AttractantHwcrXref[],
    other_attractants_text?: string,
    create_user_id?: string,
    create_utc_timestamp?: Date,
    update_user_id?: string,
    update_utc_timestamp?: Date,
  ) {
    this.complaint_identifier = complaint_identifier;
    this.species_code = species_code;
    this.hwcr_complaint_nature_code = hwcr_complaint_nature_code;
    this.attractant_hwcr_xref = attractant_hwcr_xref;
    this.other_attractants_text = other_attractants_text;
    this.create_user_id = create_user_id;
    this.create_utc_timestamp = create_utc_timestamp;
    this.update_user_id = update_user_id;
    this.update_utc_timestamp = update_utc_timestamp;
  }
}
