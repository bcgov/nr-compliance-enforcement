import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { AttractantCode } from "../../attractant_code/entities/attractant_code.entity";
import { HwcrComplaint } from "../../hwcr_complaint/entities/hwcr_complaint.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class AttractantHwcrXref {

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "System generated unique key for an attractant hwcr relationship. This key should never be exposed to users via any system utilizing the tables.",
  })
    @PrimaryGeneratedColumn()
    public attractant_hwcr_xref_guid: UUID

        @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the attractant hwcr cross reference.",
      })
      @Column({length: 32})
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the attractant hwcr cross reference.",
      })
      @Column({type: "uuid"})
      create_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the attractant hwcr cross reference was created.  The timestamp is stored in UTC with no Offset.",
      })
      @Column()
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that updated the attractant hwcr cross reference.",
      })
      @Column({length: 32})
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that updated the attractant hwcr cross reference.",
      })
      @Column({type: "uuid"})
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the attractant hwcr cross reference was updated.  The timestamp is stored in UTC with no Offset.",
      })
      @Column()
      update_timestamp: Date;

    @ManyToOne(() => AttractantCode, (attractant_code) => attractant_code.attractant_code)
    @JoinColumn({name: "attractant_code"})
    @ApiProperty({
      example: "INDCAMP",
      description: "A human readable code used to identify an attractant.",
    })
    public attractant_code: AttractantCode;

    @ManyToOne(() => HwcrComplaint, (hwcr_complaint) => hwcr_complaint.hwcr_complaint_guid)
    @JoinColumn({name: "hwcr_complaint_guid"})
    @ApiProperty({
      example: "903f87c8-76dd-427c-a1bb-4d179e443252",
      description: "System generated unique key for a hwcr complaint.",
    })
    public hwcr_complaint: HwcrComplaint;
}