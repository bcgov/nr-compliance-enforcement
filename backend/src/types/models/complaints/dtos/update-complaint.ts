import { ApiProperty } from "@nestjs/swagger";
import { ComplaintStatusCode } from "../../../../v1/complaint_status_code/entities/complaint_status_code.entity";
import { Point } from "geojson";
import { AppUserComplaintXref } from "../../../../v1/app_user_complaint_xref/entities/app_user_complaint_xref.entity";
import { ReportedByCode } from "../../../../v1/reported_by_code/entities/reported_by_code.entity";
import { CompMthdRecvCdAgcyCdXref } from "../../../../v1/comp_mthd_recv_cd_agcy_cd_xref/entities/comp_mthd_recv_cd_agcy_cd_xref";

export class UpdateComplaintDto {
  @ApiProperty({
    example: "COS-3425",
    description: "The identifier of the complaint",
  })
  complaint_identifier: string;

  @ApiProperty({
    example: "COS",
    description: "The organization code of the organization that referred the complaint",
  })
  reported_by_code: ReportedByCode;

  @ApiProperty({
    example: "COS",
    description: "The organization code of the organization that currently owns the complaint",
  })
  owned_by_agency_code_ref: string;

  @ApiProperty({
    example: "Open",
    description: "The complaint status code",
  })
  complaint_status_code: ComplaintStatusCode;

  @ApiProperty({
    example: "DCC",
    description: "The geographical organization code of the organization that currently owns the complaint",
  })
  geo_organization_unit_code: string;

  @ApiProperty({
    example: "Array of app user complaint cross references",
    description: "The app users associated with this complaint",
  })
  app_user_complaint_xref: AppUserComplaintXref[];

  @ApiProperty({
    example: "Bear overturning garbage bins",
    description: "Description of the complaint",
  })
  detail_text: string;

  @ApiProperty({
    example: "Monty Burns",
    description: "The name of the caller reporting the complaint",
  })
  caller_name: string;

  @ApiProperty({
    example: "1264 Robson St.",
    description: "The address of the caller reporting the complaint",
  })
  caller_address: string;

  @ApiProperty({
    example: "Monty Burns",
    description: "The email of the caller reporting the complaint",
  })
  caller_email: string;

  @ApiProperty({
    example: "(778)-888-5534",
    description: "The phone number of the caller reporting the complaint",
  })
  caller_phone_1: string;

  @ApiProperty({
    example: "(778)-888-5534",
    description: "The phone number of the caller reporting the complaint",
  })
  caller_phone_2: string;

  @ApiProperty({
    example: "(778)-888-5534",
    description: "The phone number of the caller reporting the complaint",
  })
  caller_phone_3: string;

  @ApiProperty({
    example: "43.43,-123.55",
    description: "The lat/long point of the complaint",
  })
  location_geometry_point: Point;

  @ApiProperty({
    example: "Near Golden",
    description: "The summary text for the location of the complaint",
  })
  location_summary_text: string;

  @ApiProperty({
    example: "10 KM Northwest of Golden",
    description: "The summary text for the location of the complaint",
  })
  location_detailed_text: string;

  @ApiProperty({
    example: "2023-11-22",
    description: "The date of the incident the complaint was filed about",
  })
  incident_reported_utc_timestmp: Date;

  @ApiProperty({
    example: "2023-11-22",
    description: "The date of the incident the complaint was filed about",
  })
  incident_utc_datetime: Date;

  @ApiProperty({
    example: "Referred to COS because of jurisdictional reaons",
    description: "The text explaining the reason for referral and other details",
  })
  reported_by_other_text: string;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the complaint",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was created",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the complaint",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was last updated",
  })
  update_utc_timestamp: Date;

  @ApiProperty({
    example: "123455",
    description:
      "Unique identifier from the webeoc source system to identify a complaint. This is required as the natural key is not avaialble in all webeoc apis",
  })
  webeoc_identifier: string;

  @ApiProperty({
    example: "54321",
    description:
      "Allows users to link complaints to files in external systems.   Currently labeled in the system as COORS reference number and initially only used for COORS linkages.",
  })
  reference_number: string;

  @ApiProperty({
    example: "RAPP",
    description: "Method in which the complaint was created",
  })
  comp_mthd_recv_cd_agcy_cd_xref: CompMthdRecvCdAgcyCdXref;

  @ApiProperty({
    example: "true",
    description:
      "flag to represent that the caller has asked for special care when handling their personal information",
  })
  is_privacy_requested: string;

  @ApiProperty({
    example: "true",
    description:
      "The time the complaint was last updated, or null if the complaint has never been touched.  This value might also be updated by business logic that touches sub-tables to indicate that the business object complaint has been updated.",
  })
  comp_last_upd_utc_timestamp: Date;

  @ApiProperty({
    example: "true",
    description: "The ID of the park that the complaint belongs to.",
  })
  park_guid: string;
}
