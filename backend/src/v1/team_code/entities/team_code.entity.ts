import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class TeamCode {
  @ApiProperty({
    example: "RIPM",
    description: "The team code",
  })
  @PrimaryColumn({ length: 10 })
  team_code: string;

  @ApiProperty({
    example: "Recycling Integrated Pest Management",
    description: "The short description of the team code",
  })
  @Column({ length: 50 })
  short_description: string;

  @ApiProperty({
    example: "Recycling Integrated Pest Management",
    description: "The long description of the team code",
  })
  @Column({ length: 250, nullable: true })
  long_description: string;

  @ApiProperty({ example: "1", description: "The display order of the tean code" })
  @Column()
  display_order: number;

  @ApiProperty({ example: "True", description: "An indicator to determine if the team code is active" })
  @Column()
  active_ind: boolean;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the team",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the team was created",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the team",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the team was last updated",
  })
  @Column()
  update_utc_timestamp: Date;

  constructor(team_code?: string) {
    this.team_code = team_code;
  }
}
