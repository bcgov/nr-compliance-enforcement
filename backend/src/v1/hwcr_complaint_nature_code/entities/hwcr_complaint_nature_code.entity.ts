import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class HwcrComplaintNatureCode {
  @ApiProperty({
    example: "HUMINJ",
    description: "A human readable code used to identify the nature of the Human Wildlife Conflict.",
  })
  @PrimaryColumn({ length: 10 })
  hwcr_complaint_nature_code: string;

  @ApiProperty({
    example: "Human injury/death",
    description: "The short description of the nature of the Human Wildlife Conflict code.",
  })
  @Column({ length: 50 })
  short_description: string;

  @ApiProperty({
    example: "Human injury/death",
    description: "The long description of the nature of the Human Wildlife Conflict code.",
  })
  @Column({ length: 250, nullable: true })
  long_description: string;

  @ApiProperty({
    example: "1",
    description:
      "The order in which the values of the nature of the Human Wildlife Conflict code table should be displayed when presented to a user in a list.",
  })
  @Column()
  display_order: number;

  @ApiProperty({
    example: "True",
    description: "A boolean indicator to determine if the nature of the Human Wildlife Conflict code is active.",
  })
  @Column()
  active_ind: boolean;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the human wildlife conflict nature code.",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the human wildlife conflict nature code was created.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that updated the human wildlife conflict nature code.",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description:
      "The timestamp when the human wildlife conflict nature code was updated.  The timestamp is stored in UTC with no Offset.",
  })
  @Column()
  update_utc_timestamp: Date;

  constructor(hwcr_complaint_nature_code?: string) {
    this.hwcr_complaint_nature_code = hwcr_complaint_nature_code;
  }
}
