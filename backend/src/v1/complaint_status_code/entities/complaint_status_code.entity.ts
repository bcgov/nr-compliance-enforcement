import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class ComplaintStatusCode {
  @ApiProperty({
    example: "OPN",
    description: "The complaint status code",
  })
  @PrimaryColumn({ length: 10 })
  complaint_status_code: string;

  @ApiProperty({ example: "Open", description: "The short description of the complaint status code" })
  @Column({ length: 50 })
  short_description: string;

  @ApiProperty({ example: "Open", description: "The short description of the complaint status code" })
  @Column({ length: 4000, nullable: true })
  long_description: string;

  @ApiProperty({ example: "1", description: "The display order of the complaint status code" })
  @Column()
  display_order: number;

  @ApiProperty({ example: "True", description: "An indicator to determine if the complaint status code is active" })
  @Column()
  active_ind: boolean;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the complaint",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was created",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the complaint",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was last updated",
  })
  @Column()
  update_utc_timestamp: Date;

  @ApiProperty({
    example: "true",
    description: "Indicates if the complaint status code can be assigned manually by a user",
  })
  @Column()
  manually_assignable_ind: boolean;

  constructor(complaint_status_code?: string) {
    this.complaint_status_code = complaint_status_code;
  }
}
