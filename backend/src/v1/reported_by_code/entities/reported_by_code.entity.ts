import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class ReportedByCode 
{
    @ApiProperty({
        example: "COS",
        description: "The reported by code",
      })
      @PrimaryColumn({length: 10})
      reported_by_code: string;
    
      @ApiProperty({ example: "CO Service", description: "The short description of the reported by code" })
      @Column({length: 50})
      short_description: string;
    
      @ApiProperty({ example: "Conservation Officer Service", description: "The long description of the reported by code" })
      @Column({length: 250, nullable: true })
      long_description: string;
    
      @ApiProperty({ example: "1", description: "The display order of the reported by code" })
      @Column()
      display_order: number;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the reported by code is active" })
      @Column()
      active_ind: boolean;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the reported by code",
      })
      @Column({length: 32})
      create_user_id: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the reported by code was created",
      })
      @Column()
      create_utc_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the reported by code",
      })
      @Column({length: 32})
      update_user_id: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the reported by code was last updated",
      })
      @Column()
      update_utc_timestamp: Date;
    
      constructor(reported_by_code?:string) {
        this.reported_by_code = reported_by_code;
      }
}
