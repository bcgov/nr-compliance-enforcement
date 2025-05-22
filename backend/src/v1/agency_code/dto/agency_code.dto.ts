import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";

export class AgencyCodeDto {
  @ApiProperty({
    example: "COS",
    description: "The agency code",
  })
  agency_code: string;

  @ApiProperty({ example: "CO Service", description: "The short description of the agency code" })
  short_description: string;

  @ApiProperty({ example: "Conservation Officer Service", description: "The long description of the agency code" })
  long_description: string;

  @ApiProperty({ example: "1", description: "The display order of the agency code" })
  display_order: number;

  @ApiProperty({ example: "True", description: "An indicator to determine if the agency code is active" })
  active_ind: boolean;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the agency",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the agency was created",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the agency",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the agency was last updated",
  })
  update_utc_timestamp: Date;

  @ApiProperty({
    example: "false",
    description: "Flag to indicate if an agency has been onboarded to Natcom or is external.",
  })
  external_agency_ind: boolean;
}
