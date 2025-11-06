import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";

export class AppUserDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The guid for this app user (formerly officer_guid)",
  })
  app_user_guid: UUID;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The keycloak guid for the app user",
  })
  auth_user_guid: UUID;

  @ApiProperty({
    example: "JSMITH",
    description: "The IDIR user id of this app user",
  })
  user_id: string;

  @ApiProperty({
    example: "John",
    description: "The first name of this app user",
  })
  first_name: string;

  @ApiProperty({
    example: "Smith",
    description: "The last name of this app user",
  })
  last_name: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The office guid for this app user",
  })
  office_guid: UUID;

  @ApiProperty({
    example: "COS",
    description: "The agency code for the app user",
  })
  agency_code_ref: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The park area guid for PARKS app users",
  })
  park_area_guid: UUID;

  @ApiProperty({
    example: true,
    description: "Indicates whether an app user has been enrolled in COMS",
  })
  coms_enrolled_ind: boolean;

  @ApiProperty({
    example: false,
    description: "Indicates whether an app user has been deactivated",
  })
  deactivate_ind: boolean;

  @ApiProperty({
    description: "User roles from CSS/Keycloak",
    type: [String],
  })
  user_roles?: string[];
}
