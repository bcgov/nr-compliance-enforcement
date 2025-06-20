import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Officer } from "../../officer/entities/officer.entity";
import { Team } from "../../team/entities/team.entity";

@Index("PK_officer_team_xref_guid", ["officer_team_xref_guid"], {
  unique: true,
})
@Entity("officer_team_xref", { schema: "complaint" })
export class OfficerTeamXref {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for an officer team relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  @Column("uuid", {
    primary: true,
    name: "officer_team_xref_guid",
  })
  officer_team_xref_guid: UUID;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the officer team cross reference.",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the officer team cross reference was created.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that updated the officer team cross reference.",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the officer team cross reference was updated.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  update_utc_timestamp: Date;

  @ManyToOne(() => Officer, (officer) => officer.officer_guid)
  @JoinColumn({ name: "officer_guid" })
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "A human readable code used to identify an officer.",
  })
  public officer_guid: Officer;

  @ManyToOne(() => Team, (team) => team.team_guid)
  @JoinColumn({ name: "team_guid" })
  @ApiProperty({
    example: "REACTIVE",
    description: "System generated unique key for a team.",
  })
  public team_guid: Team;

  @ApiProperty({
    example: "true",
    description: "A boolean indicating if this is an active officer for team",
  })
  @Column()
  public active_ind: boolean;
}
