import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class SpeciesCode {
  @ApiProperty({
    example: "GRZBEAR",
    description: "A human readable code used to identify a wildlife species.",
  })
  @PrimaryColumn({ length: 10 })
  species_code: string;

  @ApiProperty({ example: "Grizzly bear", description: "The short description of the species code." })
  @Column({ length: 50 })
  short_description: string;

  @ApiProperty({ example: "Grizzly bear", description: "The long description of the species code." })
  @Column({ length: 250, nullable: true })
  long_description: string;

  @ApiProperty({
    example: "1",
    description:
      "The order in which the values of the species code table should be displayed when presented to a user in a list.",
  })
  @Column()
  display_order: number;

  @ApiProperty({ example: "True", description: "A boolean indicator to determine if the species code is active." })
  @Column()
  active_ind: boolean;

  @ApiProperty({
    example: "COD",
    description: "The code for the species from the CORS_SPECIES_CODE table in the COORS database.   ",
  })
  @Column({ length: 10, nullable: true })
  legacy_code: string;

  @ApiProperty({
    example: "True",
    description: "A boolean indicator to determine if the species code is a large carnivore.",
  })
  @Column()
  large_carnivore_ind: boolean;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the species code.",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the species code was created.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that updated the species code.",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the species code was updated.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  update_utc_timestamp: Date;

  constructor(species_code?: string) {
    this.species_code = species_code;
  }
}
