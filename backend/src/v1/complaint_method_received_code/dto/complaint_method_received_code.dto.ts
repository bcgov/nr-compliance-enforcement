import { ApiProperty } from "@nestjs/swagger";

export class ComplaintMethodReceivedCodeDto {
  @ApiProperty({
    example: "RAPP",
    description: "The complaint method received code",
  })
  feature_code: string;

  @ApiProperty({ example: "RAPP", description: "The short description of the code" })
  short_description: string;

  @ApiProperty({
    example: "RAPP",
    description: "The long description of the code",
  })
  long_description: string;

  @ApiProperty({ example: "20", description: "The display order of the code" })
  display_order: number;

  @ApiProperty({ example: "TrFalseue", description: "An indicator to determine if the code is active" })
  active_ind: boolean;

  @ApiProperty({
    example: "JaneDoe",
    description: "The id of the user that created the code",
  })
  create_user_id: string;

  @ApiProperty({
    example: "2024-05-12 05:02:04",
    description: "The timestamp when the code was created",
  })
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "JaneDoe",
    description: "The id of the user that last updated the code",
  })
  update_user_id: string;

  @ApiProperty({
    example: "2024-05-12 05:02:04",
    description: "The timestamp when the code was last updated",
  })
  update_utc_timestamp: Date;
}
