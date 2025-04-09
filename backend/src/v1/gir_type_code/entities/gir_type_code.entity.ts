import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class GirTypeCode {
  @ApiProperty({
    example: "COCNT",
    description: "The gir type code",
  })
  @PrimaryColumn({ length: 10 })
  gir_type_code: string;

  @ApiProperty({ example: "Contact", description: "The short description of the gir type code" })
  @Column({ length: 50 })
  short_description: string;

  @ApiProperty({ example: "Contact", description: "The long description of the gir type code" })
  @Column({ length: 250, nullable: true })
  long_description: string;

  @ApiProperty({ example: "1", description: "The display order of the gir type code" })
  @Column()
  display_order: number;

  @ApiProperty({ example: "True", description: "An indicator to determine if the gir type code is active" })
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

  constructor(gir_type_code?: string) {
    this.gir_type_code = gir_type_code;
  }
}
