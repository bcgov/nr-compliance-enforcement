import { ApiProperty } from "@nestjs/swagger";

export class nickname {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  nickname: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;
}
