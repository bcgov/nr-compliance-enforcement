import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ScheduleSectorXref {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description:
      "System generated unique key for an schedule sector relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
  @PrimaryGeneratedColumn()
  public schedule_sector_xref_guid: UUID;

  @ApiProperty({
    example: "ABRASIVESI",
    description: "The sector code to indicate the industry or activity",
  })
  @Column({ length: 10 })
  sector_code: string;

  @ApiProperty({ example: "WDR1", description: "The schedule type being used" })
  @Column({ length: 10 })
  schedule_code: string;

  @ApiProperty({ example: "True", description: "An indicator to determine if the schedule sector type code is active" })
  @Column()
  active_ind: boolean;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the gir type code",
  })
  @Column({ length: 32 })
  create_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the gir type code was created",
  })
  @Column()
  create_utc_timestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the gir type code",
  })
  @Column({ length: 32 })
  update_user_id: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the gir type code was last updated",
  })
  @Column()
  update_utc_timestamp: Date;
}
