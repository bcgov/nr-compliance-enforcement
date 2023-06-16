import { ApiProperty } from "@nestjs/swagger";
import {
  Entity,
  Column,
  JoinColumn,
  PrimaryColumn,
  Index,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { ComplaintStatusCode } from "../../complaint_status_code/entities/complaint_status_code.entity";
import { AgencyCode } from "../../agency_code/entities/agency_code.entity";
import { GeoOrganizationUnitCode } from "../../geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { UUID } from "crypto";
import { Point } from "geojson";
import { CosGeoOrgUnit } from "../../cos_geo_org_unit/entities/cos_geo_org_unit.entity";

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
    description:
      "The organization code of the organization that referred the complaint",
  })
  @ManyToOne(() => AgencyCode, { nullable: true })
  @JoinColumn({ name: "referred_by_agency_code" })
  referred_by_agency_code: AgencyCode;

  @ApiProperty({
    example: "COS",
    description:
      "The organization code of the organization that currently owns the complaint",
  })
  @ManyToOne(() => AgencyCode)
  @JoinColumn({ name: "owned_by_agency_code" })
  owned_by_agency_code: AgencyCode;

  @ApiProperty({
    example: "Open",
    description: "The complaint status code",
  })
  @ManyToOne(() => ComplaintStatusCode)
  @JoinColumn({ name: "complaint_status_code" })
  complaint_status_code: ComplaintStatusCode;

  @ApiProperty({
    example: "DCC",
    description:
      "The geographical organization code of the organization that currently owns the complaint",
  })
  @ManyToOne(() => GeoOrganizationUnitCode)
  @JoinColumn({ name: "geo_organization_unit_code" })
  geo_organization_unit_code: GeoOrganizationUnitCode;

  @ApiProperty({
    example: "DCC",
    description:
      "The geographical organization code of the organization that currently owns the complaint",
  })
  @OneToOne(() => CosGeoOrgUnit)
  @JoinColumn({ name: "geo_organization_unit_code" })
  cos_geo_org_unit: CosGeoOrgUnit;

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

  /*
 @Column()
 location_geometry_point: string;
 */

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
  incident_datetime: Date;

  @ApiProperty({
    example: "2023-11-22",
    description: "The date of the incident the complaint was filed about",
  })
  @Column({ nullable: true })
  incident_reported_datetime: Date;

  @ApiProperty({
    example: "Referred to COS because of jurisdictional reaons",
    description:
      "The text explaining the reason for referral and other details",
  })
  @Column({ length: 120, nullable: true })
  referred_by_agency_other_text: string;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the complaint",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that created the complaint",
  })
  @Column({ type: "uuid" })
  create_user_guid: UUID;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was created",
  })
  @Column()
  create_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the complaint",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that last updated the complaint",
  })
  @Column({ type: "uuid" })
  update_user_guid: UUID;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was last updated",
  })
  @Column()
  update_timestamp: Date;

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
    incident_datetime?: Date,
    incident_reported_datetime?: Date,
    referred_by_agency_other_text?: string,
    create_user_id?: string,
    create_user_guid?: UUID,
    create_timestamp?: Date,
    update_user_id?: string,
    update_user_guid?: UUID,
    update_timestamp?: Date,
    complaint_identifier?: string,
    referred_by_agency_code?: AgencyCode,
    owned_by_agency_code?: AgencyCode,
    complaint_status_code?: ComplaintStatusCode,
    geo_organization_unit_code?: GeoOrganizationUnitCode,
    cos_geo_org_unit?: CosGeoOrgUnit
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
    this.incident_datetime = incident_datetime;
    this.incident_reported_datetime = incident_reported_datetime;
    this.referred_by_agency_other_text = referred_by_agency_other_text;
    this.create_user_id = create_user_id;
    this.create_user_guid = create_user_guid;
    this.create_timestamp = create_timestamp;
    this.update_user_id = update_user_id;
    this.update_user_guid = update_user_guid;
    this.update_timestamp = update_timestamp;
    this.complaint_identifier = complaint_identifier;
    this.referred_by_agency_code = referred_by_agency_code;
    this.owned_by_agency_code = owned_by_agency_code;
    this.complaint_status_code = complaint_status_code;
    this.geo_organization_unit_code = geo_organization_unit_code;
    this.cos_geo_org_unit = cos_geo_org_unit;
  }
}
