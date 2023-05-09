import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Office } from "src/v1/office/entities/office.entity";
import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Person 
{
    @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The guid for this person",
      })
      @PrimaryGeneratedColumn("uuid")
      person_guid: UUID;
      
      @ApiProperty({
        example: "Charles",
        description: "The first name of this person",
      })
      @Column({length: 32})
      first_name: string;

      @ApiProperty({
        example: "Montgumry",
        description: "The first middle name of this person",
      })
      @Column({length: 32, nullable: true })
      middle_name_1: string;

      @ApiProperty({
        example: "Patrick",
        description: "The second middle name of this person",
      })
      @Column({length: 32, nullable: true })
      middle_name_2: string;

      @ApiProperty({
        example: "Burns",
        description: "The last name of this person",
      })
      @Column({length: 32})
      last_name: string;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the person",
      })
      @Column({length: 32})
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the person",
      })
      @Column({type: "uuid"})
      create_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the person was created",
      })
      @Column()
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the person",
      })
      @Column({length: 32})
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the person",
      })
      @Column({type: "uuid"})
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the person was last updated",
      })
      @Column()
      update_timestamp: Date;
    
      constructor() {
    
      }
}
