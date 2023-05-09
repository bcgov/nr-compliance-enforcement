import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class ViolationCode 
{
    @ApiProperty({
        example: "IVL",
        description: "The violation code",
      })
      @PrimaryColumn()
      violation_code: string;
    
      @ApiProperty({ example: "Invalid License", description: "The short description of the violation code" })
      @Column()
      short_description: string;
    
      @ApiProperty({ example: "Invalid License", description: "The long description of the violation code" })
      @Column({ nullable: true })
      long_description: string;
    
      @ApiProperty({ example: "1", description: "The display order of the violation code" })
      @Column()
      display_order: number;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the violation code is active" })
      @Column()
      active_ind: boolean;

      @ApiProperty({ example: "IFK", description: "The legacy code of the violation code" })
      @Column({ nullable: true })
      legacy_code: string;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the violation",
      })
      @Column()
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the violation",
      })
      @Column()
      create_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the violation was created",
      })
      @Column()
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the violation",
      })
      @Column()
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the violation",
      })
      @Column()
      update_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the violation was last updated",
      })
      @Column()
      update_timestamp: Date;
    
      constructor() {
    
      }
}
