import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn, Index } from "typeorm";
import { ComplaintStatusCode } from "src/v1/complaint_status_code/entities/complaint_status_code.entity";
import { AgencyCode } from "src/v1/agency_code/entities/agency_code.entity";
import { GeoOrganizationUnitCode } from "src/v1/geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { UUID } from "crypto";
import { Point } from "geojson";

@Entity()
export class Complaint {
  @ApiProperty({
    example: "COS-324",
    description: "The ID of the complaint",
  })
  @PrimaryColumn({length: 20})
  complaint_identifier: string;

  @ApiProperty({
    example: "COS",
    description: "The organization code of the organization that referred the complaint",
  })
  @OneToOne(() => AgencyCode, { nullable: true })
  @JoinColumn({name: "referred_by_agency_code"})
  referred_by_agency_code: AgencyCode;

  @ApiProperty({
    example: "COS",
    description: "The organization code of the organization that currently owns the complaint",
  })
  @OneToOne(() => AgencyCode)
  @JoinColumn({name: "owned_by_agency_code"})
  owned_by_agency_code: AgencyCode;

  @ApiProperty({
    example: "Open",
    description: "The complaint status code",
  })
  @OneToOne(() => ComplaintStatusCode)
  @JoinColumn({name: "complaint_status_code"})
  complaint_status_code: ComplaintStatusCode;

  @ApiProperty({
    example: "DCC",
    description: "The geographical organization code of the organization that currently owns the complaint",
  })
  @OneToOne(() => GeoOrganizationUnitCode)
  @JoinColumn({name: "geo_organization_unit_code"})
  geo_organization_unit_code: GeoOrganizationUnitCode;

  @ApiProperty({
    example: "Bear overturning garbage bins",
    description: "Description of the complaint",
  })
  @Column({length: 250, nullable: true })
  detail_text: string;

  @ApiProperty({
    example: "Monty Burns",
    description: "The name of the caller reporting the complaint",
  })
  @Column({length: 120, nullable: true })
  caller_name: string;

  @ApiProperty({
    example: "1264 Robson St.",
    description: "The address of the caller reporting the complaint",
  })
  @Column({length: 120, nullable: true })
  caller_address: string;

  @ApiProperty({
    example: "Monty Burns",
    description: "The email of the caller reporting the complaint",
  })
  @Column({length: 120, nullable: true })
  caller_email: string;

  @ApiProperty({
    example: "(778)-888-5534",
    description: "The phone number of the caller reporting the complaint",
  })
  @Column({length: 15, nullable: true })
  caller_phone_1: string;

  @ApiProperty({
    example: "(778)-888-5534",
    description: "The phone number of the caller reporting the complaint",
  })
  @Column({length: 15, nullable: true })
  caller_phone_2: string;

  @ApiProperty({
    example: "(778)-888-5534",
    description: "The phone number of the caller reporting the complaint",
  })
  @Column({length: 15, nullable: true })
  caller_phone_3: string;


  @ApiProperty({
    example: "43.43,-123.55",
    description: "The lat/long point of the complaint",
  })

  @Index({ spatial: true })
  @Column({
  type: 'geometry',
  nullable: true,
  spatialFeatureType: 'Point',
  srid: 4326
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
  @Column({length: 120, nullable: true })
  location_summary_text: string;

  @ApiProperty({
    example: "10 KM Northwest of Golden",
    description: "The detailed text for the location of the complaint",
  })
  @Column({length: 255, nullable: true })
  location_detailed_text: string;

  @ApiProperty({
    example: "2023-11-22",
    description: "The date of the incident the complaint was filed about",
  })
  @Column({ nullable: true })
  incident_date: Date;

  @ApiProperty({
    example: "Referred to COS because of jurisdictional reaons",
    description: "The text explaining the reason for referral and other details",
  })
  @Column({length: 120, nullable: true })
  referred_by_agency_other_text: string;

  @ApiProperty({
    example: "IDIR\mburns",
    description: "The id of the user that created the complaint",
  })
  @Column({length: 32})
  create_user_id: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that created the complaint",
  })
  @Column({type: "uuid"})
  create_user_guid: UUID;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was created",
  })
  @Column()
  create_timestamp: Date;

  @ApiProperty({
    example: "IDIR\mburns",
    description: "The id of the user that last updated the complaint",
  })
  @Column({length: 32})
  update_user_id: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that last updated the complaint",
  })
  @Column({type: "uuid"})
  update_user_guid: UUID;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was last updated",
  })
  @Column()
  update_timestamp: Date;

  constructor() {

  }

}
