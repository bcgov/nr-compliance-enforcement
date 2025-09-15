import { ApiProperty } from "@nestjs/swagger";

export class temp_poc {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  first_name: string;

  @ApiProperty({ type: String })
  last_name: string;
}
