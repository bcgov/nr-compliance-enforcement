import { ApiProperty } from "@nestjs/swagger";
import { Office } from "src/v1/office/entities/office.entity";
import { Person } from "src/v1/person/entities/person.entity";
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, Unique } from "typeorm";

@Entity()
@Unique(["person_guid"])
export class Officer 
{
    @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The guid for this officer",
      })
      @PrimaryColumn()
      officer_guid: string;

      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The person for this officer",
      })
      @OneToOne(() => Person)
      @JoinColumn()
      person_guid: Person;

      @ApiProperty({
        example: "DCC",
        description: "The office for this officer",
      })
      @OneToOne(() => Office, { nullable: true })
      @JoinColumn()
      office_guid: Office;
      
      @ApiProperty({
        example: "Charles",
        description: "The user id of this officer",
      })
      @Column()
      user_id: string;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the officer",
      })
      @Column()
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the officer",
      })
      @Column()
      create_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the officer was created",
      })
      @Column()
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the officer",
      })
      @Column()
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the officer",
      })
      @Column()
      update_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the officer was last updated",
      })
      @Column()
      update_timestamp: Date;
    
      constructor() {
    
      }
}
