import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, JoinColumn, PrimaryColumn, Index, ManyToOne, OneToOne, OneToMany } from "typeorm";
import { ComplaintStatusCode } from "../../complaint_status_code/entities/complaint_status_code.entity";
import { Point } from "geojson";
import { AppUserComplaintXref } from "../../app_user_complaint_xref/entities/app_user_complaint_xref.entity";
import { ReportedByCode } from "../../reported_by_code/entities/reported_by_code.entity";
import { CompMthdRecvCdAgcyCdXref } from "../../comp_mthd_recv_cd_agcy_cd_xref/entities/comp_mthd_recv_cd_agcy_cd_xref";
import { LinkedComplaintXref } from "../../linked_complaint_xref/entities/linked_complaint_xref.entity";
import { ComplaintUpdate } from "../../complaint_updates/entities/complaint_updates.entity";
import { ActionTaken } from "./action_taken.entity";
import { ComplaintReferral } from "../../complaint_referral/entities/complaint_referral.entity";
import { ComplaintTypeCode } from "../../complaint_type_code/entities/complaint_type_code.entity";

@Entity()
export class Complaint {
  @ApiProperty({
    example: "COS-324",
    description: "The ID of the complaint",
  })
  @PrimaryColumn({ length: 20 })
  complaint_identifier: string;

  @ApiProperty({
    example: "COS",
    description: "The organization code of the organization that reported the complaint",
  })
  @ManyToOne(() => ReportedByCode, { nullable: true })
  @JoinColumn({ name: "reported_by_code" })
  reported_by_code: ReportedByCode;

  @ApiProperty({
    example: "COS",
    description: "The organization code of the organization that currently owns the complaint",
  })
  @Column({ name: "owned_by_agency_code_ref" })
  owned_by_agency_code_ref: string;

  @ApiProperty({
    example: "Open",
    description: "The complaint status code",
  })
  @ManyToOne(() => ComplaintStatusCode)
  @JoinColumn({ name: "complaint_status_code" })
  complaint_status_code: ComplaintStatusCode;

  @ManyToOne(() => CompMthdRecvCdAgcyCdXref)
  @JoinColumn({ name: "comp_mthd_recv_cd_agcy_cd_xref_guid" })
  comp_mthd_recv_cd_agcy_cd_xref: CompMthdRecvCdAgcyCdXref;

  @ApiProperty({
    example: "DCC",
    description: "The geographical organization code of the organization that currently owns the complaint",
  })
  @Column({ name: "geo_organization_unit_code", nullable: true })
  geo_organization_unit_code: string;

  @ApiProperty({
    example: "DCC",
    description: "The geographical organization code of the organization that currently owns the complaint",
  })
  @OneToMany(() => AppUserComplaintXref, (app_user_complaint_xref) => app_user_complaint_xref.complaint_identifier)
  app_user_complaint_xref: AppUserComplaintXref[];

  @ApiProperty({
    example: "Bear overturning garbage bins",
    description: "Description of the complaint",
  })
  @Column({ length: 4000, nullable: true })
  detail_text: string;

  @ApiProperty({
    example: "Monty Burns",
    description: "The name of the caller reporting the complaint",
  })
  @Column({ length: 120, nullable: true })
  caller_name: string;

  @ApiProperty({
    example: "1264 Robson St.",
    description: "The address of the caller reporting the complaint",
  })
  @Column({ length: 120, nullable: true })
  caller_address: string;

  @ApiProperty({
    example: "Monty Burns",
    description: "The email of the caller reporting the complaint",
  })
  @Column({ length: 120, nullable: true })
  caller_email: string;

  @ApiProperty({
    example: "(778)-888-5534",
    description: "The phone number of the caller reporting the complaint",
  })
  @Column({ length: 15, nullable: true })
  caller_phone_1: string;

  @ApiProperty({
    example: "(778)-888-5534",
    description: "The phone number of the caller reporting the complaint",
  })
  @Column({ length: 15, nullable: true })
  caller_phone_2: string;

  @ApiProperty({
    example: "(778)-888-5534",
    description: "The phone number of the caller reporting the complaint",
  })
  @Column({ length: 15, nullable: true })
  caller_phone_3: string;

  @ApiProperty({
    example: "123455",
    description:
      "Unique identifier from the webeoc source system to identify a complaint. This is required as the natural key is not avaialble in all webeoc apis",
  })
  @Column({ length: 20 })
  webeoc_identifier: string;

  @ApiProperty({
    example: "54321",
    description:
      "Allows users to link complaints to files in external systems.   Currently labeled in the system as COORS reference number and initially only used for COORS linkages.",
  })
  @Column({ length: 20 })
  reference_number: string;

  @ApiProperty({
    example: "43.43,-123.55",
    description: "The lat/long point of the complaint",
  })
  @Index({ spatial: true })
  @Column({
    type: "geometry",
    nullable: true,
    srid: 4326,
  })
  location_geometry_point: Point;

  @ApiProperty({
    example: "Near Golden",
    description: "The summary text for the location of the complaint",
  })
  @Column({ length: 120, nullable: true })
  location_summary_text: string;

  @ApiProperty({
    example: "10 KM Northwest of Golden",
    description: "The detailed text for the location of the complaint",
  })
  @Column({ length: 4000, nullable: true })
  location_detailed_text: string;

  @ApiProperty({
    example: "2023-11-22",
    description: "The date of the incident the complaint was filed about",
  })
  @Column({ nullable: true })
  incident_utc_datetime: Date;

  @ApiProperty({
    example: "2023-11-22",
    description: "The date of the incident the complaint was filed about",
  })
  @Column({ nullable: true })
  incident_reported_utc_timestmp: Date;

  @ApiProperty({
    example: "Referred to COS because of jurisdictional reaons",
    description: "The text explaining the reason for referral and other details",
  })
  @Column({ length: 120, nullable: true })
  reported_by_other_text: string;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the complaint",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was created",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the complaint",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was last updated",
  })
  @Column()
  update_utc_timestamp: Date;

  @ApiProperty({
    example: "true",
    description:
      "flag to represent that the caller has asked for special care when handling their personal information",
  })
  @Column()
  is_privacy_requested: string;

  @OneToMany(() => LinkedComplaintXref, (linked_complaint_xref) => linked_complaint_xref.linked_complaint_identifier)
  linked_complaint_xref: LinkedComplaintXref[];

  @ApiProperty({
    example: "Details text was updated with new information.",
    description: "The complaint updates",
  })
  @OneToMany(() => ComplaintUpdate, (complaint_update) => complaint_update.complaintIdentifier)
  complaint_update: ComplaintUpdate[];

  @ApiProperty({
    example: "Officer XYZ assigned this to ABC",
    description: "The actions taken on tihs complaint",
  })
  @OneToMany(() => ActionTaken, (action_taken) => action_taken.complaintIdentifier)
  action_taken: ActionTaken[];

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The time the complaint was last updated, or null if the complaint has never been touched.  This value might also be updated by business logic that touches sub-tables to indicate that the business object complaint has been updated.",
  })
  @Column({ nullable: true })
  comp_last_upd_utc_timestamp: Date;

  @ApiProperty({
    example: "Referred from COS to CEEB",
    description: "Complaint referrals",
  })
  @OneToMany(() => ComplaintReferral, (complaint_referral) => complaint_referral.complaint_identifier)
  complaint_referral: ComplaintReferral[];

  @ApiProperty({
    example: "ad23357b-1f47-4561-beff-63ae1c9c3d8f",
    description: "The id of the park that this complaint is associated with",
  })
  @Column({ length: 32, nullable: true })
  park_guid: string;

  @ApiProperty({
    example: "HWCR",
    description: "The complaint type code",
  })
  @ManyToOne(() => ComplaintTypeCode)
  @JoinColumn({ name: "complaint_type_code" })
  complaint_type_code: ComplaintTypeCode;

  constructor(
    detail_text?: string,
    caller_name?: string,
    caller_address?: string,
    caller_email?: string,
    caller_phone_1?: string,
    caller_phone_2?: string,
    caller_phone_3?: string,
    location_geometry_point?: Point,
    location_summary_text?: string,
    location_detailed_text?: string,
    incident_utc_datetime?: Date,
    incident_reported_utc_timestmp?: Date,
    reported_by_other_text?: string,
    create_user_id?: string,
    create_utc_timestamp?: Date,
    update_user_id?: string,
    update_utc_timestamp?: Date,
    complaint_identifier?: string,
    reported_by_code?: ReportedByCode,
    owned_by_agency_code_ref?: string,
    complaint_status_code?: ComplaintStatusCode,
    geo_organization_unit_code?: string,
    linked_complaint_xref?: LinkedComplaintXref[],
    app_user_complaint_xref?: AppUserComplaintXref[],
    webeoc_identifier?: string,
    reference_number?: string,
    comp_mthd_recv_cd_agcy_cd_xref?: CompMthdRecvCdAgcyCdXref,
    is_privacy_requested?: string,
    complaint_update?: ComplaintUpdate[],
    action_taken?: ActionTaken[],
    comp_last_upd_utc_timestamp?: Date,
    complaint_referral?: ComplaintReferral[],
    park_guid?: string,
    complaint_type_code?: ComplaintTypeCode,
  ) {
    this.detail_text = detail_text;
    this.caller_name = caller_name;
    this.caller_address = caller_address;
    this.caller_email = caller_email;
    this.caller_phone_1 = caller_phone_1;
    this.caller_phone_2 = caller_phone_2;
    this.caller_phone_3 = caller_phone_3;
    this.location_geometry_point = location_geometry_point;
    this.location_summary_text = location_summary_text;
    this.location_detailed_text = location_detailed_text;
    this.incident_utc_datetime = incident_utc_datetime;
    this.incident_reported_utc_timestmp = incident_reported_utc_timestmp;
    this.reported_by_other_text = reported_by_other_text;
    this.create_user_id = create_user_id;
    this.create_utc_timestamp = create_utc_timestamp;
    this.update_user_id = update_user_id;
    this.update_utc_timestamp = update_utc_timestamp;
    this.complaint_identifier = complaint_identifier;
    this.reported_by_code = reported_by_code;
    this.owned_by_agency_code_ref = owned_by_agency_code_ref;
    this.complaint_status_code = complaint_status_code;
    this.geo_organization_unit_code = geo_organization_unit_code;
    this.linked_complaint_xref = linked_complaint_xref;
    this.app_user_complaint_xref = app_user_complaint_xref;
    this.webeoc_identifier = webeoc_identifier;
    this.reference_number = reference_number;
    this.comp_mthd_recv_cd_agcy_cd_xref = comp_mthd_recv_cd_agcy_cd_xref;
    this.is_privacy_requested = is_privacy_requested;
    this.complaint_update = complaint_update;
    this.action_taken = action_taken;
    this.comp_last_upd_utc_timestamp = comp_last_upd_utc_timestamp;
    this.complaint_referral = complaint_referral;
    this.park_guid = park_guid;
    this.complaint_type_code = complaint_type_code;
  }
}
