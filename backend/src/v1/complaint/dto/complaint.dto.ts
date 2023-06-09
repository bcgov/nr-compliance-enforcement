import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { AgencyCode } from '../../agency_code/entities/agency_code.entity';
import { ComplaintStatusCode } from '../../complaint_status_code/entities/complaint_status_code.entity';
import { GeoOrganizationUnitCode } from '../../geo_organization_unit_code/entities/geo_organization_unit_code.entity';
import { Geometry, Point } from 'geojson';

export class ComplaintDto {
  @ApiProperty({
    example: "COS-3425",
    description: "The identifier of the complaint",
  })
  complaint_identifier: string;

  @ApiProperty({
    example: "COS",
    description: "The organization code of the organization that referred the complaint",
  })
  referred_by_agency_code: AgencyCode;

  @ApiProperty({
    example: "COS",
    description: "The organization code of the organization that currently owns the complaint",
  })
  owned_by_agency_code: AgencyCode;

  @ApiProperty({
    example: "Open",
    description: "The complaint status code",
  })
  complaint_status_code: ComplaintStatusCode;

  @ApiProperty({
    example: "DCC",
    description: "The geographical organization code of the organization that currently owns the complaint",
  })
  geo_organization_unit_code: GeoOrganizationUnitCode;

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
  incident_reported_datetime: Date;

  @ApiProperty({
    example: "Referred to COS because of jurisdictional reaons",
    description: "The text explaining the reason for referral and other details",
  })
  referred_by_agency_other_text: string;

  @ApiProperty({
    example: "IDIR\mburns",
    description: "The id of the user that created the complaint",
  })
  create_user_id: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that created the complaint",
  })
  create_user_guid: UUID;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was created",
  })
  create_timestamp: Date;

  @ApiProperty({
    example: "IDIR\mburns",
    description: "The id of the user that last updated the complaint",
  })
  update_user_id: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that last updated the complaint",
  })
  update_user_guid: UUID;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was last updated",
  })
  update_timestamp: Date;
}
