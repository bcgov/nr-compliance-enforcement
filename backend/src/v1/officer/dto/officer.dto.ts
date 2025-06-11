import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { OfficeDto } from "../../office/dto/office.dto";
import { PersonDto } from "../../person/dto/person.dto";
import { AgencyCodeDto } from "../../agency_code/dto/agency_code.dto";

export class OfficerDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The guid for this officer",
  })
  officer_guid: UUID;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The person for this officer",
  })
  person_guid: PersonDto;

  @ApiProperty({
    example: "DCC",
    description: "The office for this officer",
  })
  office_guid: OfficeDto;

  @ApiProperty({
    example: "Charles",
    description: "The user id of this officer",
  })
  user_id: string;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the officer",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the officer was created",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the officer",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the officer was last updated",
  })
  update_utc_timestamp: Date;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The keycloak guid for the officer",
  })
  auth_user_guid: UUID;

  @ApiProperty({
    example: "true",
    description: "An indicator to determine if the officer has access to COMS",
  })
  coms_enrolled_ind: boolean;

  @ApiProperty({
    example: "false",
    description: "An indicator to determine if the officer has been deactivated",
  })
  deactivate_ind: boolean;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The guid for park area of PARK officer",
  })
  park_area_guid: UUID;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The guid for park area of PARK officer",
  })
  agency_code: AgencyCodeDto;
}
