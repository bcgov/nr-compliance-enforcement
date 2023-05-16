import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { AttractantHwcrXref } from "src/v1/attractant_hwcr_xref/entities/attractant_hwcr_xref.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class AttractantCode 
{
    @ApiProperty({
        example: "INDCAMP",
        description: "A human readable code used to identify an attractant.",
      })
      @PrimaryColumn({length: 10})
      attractant_code: string;
    
      @ApiProperty({ example: "Industrial Camp", description: "The short description of the attractant code." })
      @Column({length: 50})
      short_description: string;
    
      @ApiProperty({ example: "Industrial Camp", description: "The long description of the attractant code." })
      @Column({length: 250, nullable: true })
      long_description: string;
    
      @ApiProperty({ example: "1", description: "The order in which the values of the attractant code table should be displayed when presented to a user in a list." })
      @Column()
      display_order: number;
    
      @ApiProperty({ example: "True", description: "A boolean indicator to determine if the attractant code is active." })
      @Column()
      active_ind: boolean;

      @OneToMany(() => AttractantHwcrXref, attractant_hwcr_xref => attractant_hwcr_xref.attractant_code)
      @JoinColumn({name: "attractant_code"})
      attractant_hwcr_xref: AttractantHwcrXref[];
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the attractant code.",
      })
      @Column({length: 32})
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the attractant code.",
      })
      @Column({type: "uuid"})
      create_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the attractant code was created.  The timestamp is stored in UTC with no Offset.",
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
        description: "The unique guid of the user that updated the attractant code.",
      })
      @Column({type: "uuid"})
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the attractant code was updated.  The timestamp is stored in UTC with no Offset.",
      })
      @Column()
      update_timestamp: Date;
    
      constructor(attractant_code?:string) {
        this.attractant_code = attractant_code;
      }
}
