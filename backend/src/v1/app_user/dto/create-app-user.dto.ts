import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";

export class CreateAppUserDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The keycloak guid for the app user",
    required: false,
  })
  auth_user_guid?: UUID;

  @ApiProperty({
    example: "JSMITH",
    description: "The IDIR user id",
    required: false,
  })
  user_id?: string;

  @ApiProperty({
    example: "John",
    description: "The first name of the app user",
  })
  first_name: string;

  @ApiProperty({
    example: "Smith",
    description: "The last name of the app user",
  })
  last_name: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The office guid",
    required: false,
  })
  office_guid?: UUID;

  @ApiProperty({
    example: "COS",
    description: "The agency code",
    required: false,
  })
  agency_code_ref?: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The park area guid for PARKS users",
    required: false,
  })
  park_area_guid?: UUID;

  @ApiProperty({
    example: false,
    description: "COMS enrollment indicator",
    required: false,
  })
  coms_enrolled_ind?: boolean;

  @ApiProperty({
    example: false,
    description: "Deactivation indicator",
    required: false,
  })
  deactivate_ind?: boolean;

  @ApiProperty({
    example: "RIPM",
    description: "Team code for team assignment",
    required: false,
  })
  team_code?: string;

  @ApiProperty({
    description: "User roles",
    required: false,
  })
  roles?: {
    user_idir: string;
    user_roles: Array<{ name: string }>;
  };
}
