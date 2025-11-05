import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";

export class ViolationCodeDto {
  @ApiProperty({
    example: "IVL",
    description: "The violation code",
  })
  violation_code: string;

  @ApiProperty({ example: "Invalid License", description: "The short description of the violation code" })
  short_description: string;

  @ApiProperty({ example: "Invalid License", description: "The long description of the violation code" })
  long_description: string;

  @ApiProperty({ example: "1", description: "The display order of the violation code" })
  display_order: number;

  @ApiProperty({ example: "True", description: "An indicator to determine if the violation code is active" })
  active_ind: boolean;

  @ApiProperty({ example: "IFK", description: "The legacy code of the violation code" })
  legacy_code: string;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the violation",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the violation was created",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the violation",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the violation was last updated",
  })
  update_utc_timestamp: Date;
}
