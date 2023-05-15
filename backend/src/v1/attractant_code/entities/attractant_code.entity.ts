import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { AttractantHwcrXref } from "src/v1/attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class AttractantCode 
{
    @ApiProperty({
        example: "COS",
        description: "The attractant code",
      })
      @PrimaryColumn({length: 10})
      attractant_code: string;
    
      @ApiProperty({ example: "CO Service", description: "The short description of the attractant code" })
      @Column({length: 50})
      short_description: string;
    
      @ApiProperty({ example: "Conservation Officer Service", description: "The long description of the attractant code" })
      @Column({length: 250, nullable: true })
      long_description: string;
    
      @ApiProperty({ example: "1", description: "The display order of the attractant code" })
      @Column()
      display_order: number;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the attractant code is active" })
      @Column()
      active_ind: boolean;

      @OneToMany(() => AttractantHwcrXref, attractant_hwcr_xref => attractant_hwcr_xref.attractant_code)
      @JoinColumn({name: "attractant_code"})
      attractant_hwcr_xref: AttractantHwcrXref[];
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the attractant",
      })
      @Column({length: 32})
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the attractant",
      })
      @Column({type: "uuid"})
      create_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the attractant was created",
      })
      @Column()
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the attractant",
      })
      @Column({length: 32})
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the attractant",
      })
      @Column({type: "uuid"})
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the attractant was last updated",
      })
      @Column()
      update_timestamp: Date;
    
      constructor(attractant_code?:string) {
        this.attractant_code = attractant_code;
      }
}
