import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class AgencyCode 
{
    @ApiProperty({
        example: "COS",
        description: "The agency code",
      })
      @PrimaryColumn({length: 3})
      agency_code: string;
    
      @ApiProperty({ example: "CO Service", description: "The short description of the agency code" })
      @Column({length: 120})
      short_description: string;
    
      @ApiProperty({ example: "Conservation Officer Service", description: "The long description of the agency code" })
      @Column({length: 120, nullable: true })
      long_description: string;
    
      @ApiProperty({ example: "1", description: "The display order of the agency code" })
      @Column()
      display_order: number;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the agency code is active" })
      @Column()
      active_ind: boolean;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the agency",
      })
      @Column({length: 32})
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the agency",
      })
      @Column({type: "uuid"})
      create_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the agency was created",
      })
      @Column()
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the agency",
      })
      @Column({length: 32})
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the agency",
      })
      @Column({type: "uuid"})
      update_user_guid: UUID;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the agency was last updated",
      })
      @Column()
      update_timestamp: Date;
    
      constructor() {
    
      }
}
