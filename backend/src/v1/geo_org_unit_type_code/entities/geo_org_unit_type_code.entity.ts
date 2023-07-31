import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class GeoOrgUnitTypeCode 
{
    @ApiProperty({
        example: "D",
        description: "The geo org unit type code",
      })
      @PrimaryColumn({length: 10})
      geo_org_unit_type_code: string;
    
      @ApiProperty({ example: "Invalid License", description: "The short description of the geo org unit type code" })
      @Column({length: 50})
      short_description: string;
    
      @ApiProperty({ example: "Invalid License", description: "The long description of the geo org unit type code" })
      @Column({length: 250, nullable: true })
      long_description: string;
    
      @ApiProperty({ example: "1", description: "The display order of the geo org unit type code" })
      @Column()
      display_order: number;
    
      @ApiProperty({ example: "True", description: "An indicator to determine if the geo org unit type code is active" })
      @Column()
      active_ind: boolean;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the geo org unit type",
      })
      @Column({length: 32})
      create_user_id: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the geo org unit type was created",
      })
      @Column()
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the geo org unit type",
      })
      @Column({length: 32})
      update_user_id: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the geo org unit type was last updated",
      })
      @Column()
      update_timestamp: Date;
    
      constructor(geo_org_unit_type_code?: string) {
        this.geo_org_unit_type_code = geo_org_unit_type_code;
      }
}
