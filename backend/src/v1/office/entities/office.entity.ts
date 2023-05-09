import { ApiProperty } from "@nestjs/swagger";
import { AgencyCode } from "src/v1/agency_code/entities/agency_code.entity";
import { GeoOrganizationUnitCode } from "src/v1/geo_organization_unit_code/entities/geo_organization_unit_code.entity";
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";

@Entity()
export class Office 
{
    @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The guid for this office",
      })
      @PrimaryColumn()
      office_guid: string;

      @ApiProperty({
        example: "DCC",
        description: "The geo organization code for the office",
      })
      @OneToOne(() => GeoOrganizationUnitCode, { nullable: true })
      @JoinColumn()
      geo_organization_unit_code: GeoOrganizationUnitCode;
      
      @ApiProperty({
        example: "COS",
        description: "The agency code for the office",
      })
      @OneToOne(() => AgencyCode)
      @JoinColumn()
      agency_code: AgencyCode;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the office",
      })
      @Column()
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the office",
      })
      @Column()
      create_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the office was created",
      })
      @Column()
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the office",
      })
      @Column()
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the office",
      })
      @Column()
      update_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the office was last updated",
      })
      @Column()
      update_timestamp: Date;
    
      constructor() {
    
      }
}
