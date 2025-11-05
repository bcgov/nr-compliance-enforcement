import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { AttractantHwcrXref } from "../../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";

export class AttractantCodeDto {
  @ApiProperty({
    example: "INDCAMP",
    description: "A human readable code used to identify an attractant.",
  })
  attractant_code: string;

  @ApiProperty({ example: "Industrial Camp", description: "The short description of the attractant code." })
  short_description: string;

  @ApiProperty({ example: "Industrial Camp", description: "The long description of the attractant code." })
  long_description: string;

  @ApiProperty({
    example: "1",
    description:
      "The order in which the values of the attractant code table should be displayed when presented to a user in a list.",
  })
  display_order: number;

  @ApiProperty({ example: "True", description: "A boolean indicator to determine if the attractant code is active." })
  active_ind: boolean;

  attractant_hwcr_xref: AttractantHwcrXref[];

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the attractant code.",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the attractant code was created.  The timestamp is stored in UTC with no Offset.",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the attractant",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the attractant code was updated.  The timestamp is stored in UTC with no Offset.",
  })
  update_utc_timestamp: Date;
}
