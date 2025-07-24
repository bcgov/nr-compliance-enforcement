import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamCode } from "../../team_code/entities/team_code.entity";

@Entity()
export class Team {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for an team agency relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  @PrimaryGeneratedColumn()
  public team_guid: UUID;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the team agency cross reference.",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the team agency cross reference was created.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that updated the team agency cross reference.",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the team agency cross reference was updated.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  update_utc_timestamp: Date;

  @ManyToOne(() => TeamCode, (team_code) => team_code.team_code)
  @JoinColumn({ name: "team_code" })
  @ApiProperty({
    example: "RIPM",
    description: "A human readable code used to identify a team.",
  })
  public team_code: TeamCode;

  @Column()
  @ApiProperty({
    example: "EPO",
    description: "System generated unique key for a agency.",
  })
  public agency_code_ref: string;

  @ApiProperty({
    example: "true",
    description: "A boolean indicating if this is an active team for agency",
  })
  @Column()
  public active_ind: boolean;
}
