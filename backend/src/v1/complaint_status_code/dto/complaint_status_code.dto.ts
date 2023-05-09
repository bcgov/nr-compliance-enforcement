import { ApiProperty } from "@nestjs/swagger";

export class ComplaintStatusCodeDto {
  @ApiProperty({
    example: "OPN",
    description: "The complaint status code",
  })
  complaint_status_code: string;

  @ApiProperty({ example: "Open", description: "The short description of the complaint status code" })
  short_description: string;

  @ApiProperty({ example: "Open", description: "The short description of the complaint status code" })
  long_description: string;

  @ApiProperty({ example: "1", description: "The display order of the complaint status code" })
  display_order: number;

  @ApiProperty({ example: "True", description: "An indicator to determine if the complaint status code is active" })
  active_ind: boolean;

  @ApiProperty({
    example: "IDIR\mburns",
    description: "The id of the user that created the complaint",
  })
  create_user_id: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that created the complaint",
  })
  create_user_guid: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was created",
  })
  create_timestamp: Date;

  @ApiProperty({
    example: "IDIR\mburns",
    description: "The id of the user that last updated the complaint",
  })
  update_user_id: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that last updated the complaint",
  })
  update_user_guid: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was last updated",
  })
  update_timestamp: Date;

  constructor() {

  }
}
