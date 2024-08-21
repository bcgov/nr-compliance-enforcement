import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Officer } from "../../officer/entities/officer.entity";
import { Team } from "../../team/entities/team.entity";

export class OfficerTeamXrefDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for an officer agency relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  public officer_team_xref_guid: UUID;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the officer team cross reference.",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the officer team cross reference was created.  The timestamp is stored in UTC with no Offset.",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that updated the officer team cross reference.",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the officer team cross reference was updated.  The timestamp is stored in UTC with no Offset.",
  })
  update_utc_timestamp: Date;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "A human readable code used to identify a officer.",
  })
  public officer_guid: Officer;

  @ApiProperty({
    example: "REACTIVE",
    description: "A human readable code used to identify an team.",
  })
  public team_guid: Team;

  @ApiProperty({
    example: "true",
    description: "A boolean indicating if this is an active officer for the team",
  })
  public active_ind: boolean;
}
