import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";

export class SpeciesCodeDto {
  @ApiProperty({
    example: "GRZBEAR",
    description: "A human readable code used to identify a wildlife species.",
  })
  species_code: string;

  @ApiProperty({ example: "Grizzly bear", description: "The short description of the species code." })
  short_description: string;

  @ApiProperty({ example: "Grizzly bear", description: "The long description of the species code." })
  long_description: string;

  @ApiProperty({
    example: "1",
    description:
      "The order in which the values of the species code table should be displayed when presented to a user in a list.",
  })
  display_order: number;

  @ApiProperty({ example: "True", description: "A boolean indicator to determine if the species code is active." })
  active_ind: boolean;

  @ApiProperty({
    example: "COD",
    description: "The code for the species from the CORS_SPECIES_CODE table in the COORS database.   ",
  })
  legacy_code: string;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the species code.",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the species code was created.  The timestamp is stored in UTC with no Offset.",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that updated the species code.",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the species code was updated.  The timestamp is stored in UTC with no Offset.",
  })
  update_utc_timestamp: Date;
}
