import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class ComplaintStatusCode {
  @ApiProperty({
    example: "OPN",
    description: "The complaint status code",
  })
  @PrimaryColumn()
  complaint_status_code: string;

  @ApiProperty({ example: "Open", description: "The short description of the complaint status code" })
  @Column()
  short_description: string;

  @ApiProperty({ example: "Open", description: "The short description of the complaint status code" })
  @Column( {nullable: true} )
  long_description: string;

  @ApiProperty({ example: "1", description: "The display order of the complaint status code" })
  @Column()
  display_order: number;

  @ApiProperty({ example: "True", description: "An indicator to determine if the complaint status code is active" })
  @Column()
  active_ind: boolean;

  @ApiProperty({
    example: "IDIR\mburns",
    description: "The id of the user that created the complaint",
  })
  @Column()
  create_user_id: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that created the complaint",
  })
  @Column()
  create_user_guid: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was created",
  })
  @Column()
  create_timestamp: Date;

  @ApiProperty({
    example: "IDIR\mburns",
    description: "The id of the user that last updated the complaint",
  })
  @Column()
  update_user_id: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that last updated the complaint",
  })
  @Column()
  update_user_guid: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was last updated",
  })
  @Column()
  update_timestamp: Date;

  constructor() {

  }
}
