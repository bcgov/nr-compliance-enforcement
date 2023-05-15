import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class SpeciesCode 
{
    @ApiProperty({
        example: "COS",
        description: "The species code",
      })
      @PrimaryColumn({length: 10})
      species_code: string;
    
      @ApiProperty({ example: "CO Service", description: "The short description of the species code" })
      @Column({length: 50})
      short_description: string;
    
      @ApiProperty({ example: "Conservation Officer Service", description: "The long description of the species code" })
      @Column({length: 250, nullable: true })
      long_description: string;
    
      @ApiProperty({ example: "1", description: "The display order of the species code" })
      @Column()
      display_order: number;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the species code is active" })
      @Column()
      active_ind: boolean;

      @ApiProperty({ example: "COD", description: ""})
      @Column({length: 10, nullable: true})
      legacy_code: string;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the species",
      })
      @Column({length: 32})
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the species",
      })
      @Column({type: "uuid"})
      create_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the species was created",
      })
      @Column()
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the species",
      })
      @Column({length: 32})
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the species",
      })
      @Column({type: "uuid"})
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the species was last updated",
      })
      @Column()
      update_timestamp: Date;
    
      constructor(species_code?:string) {
        this.species_code = species_code;
      }
}
