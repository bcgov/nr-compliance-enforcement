import { ApiProperty } from "@nestjs/swagger";
import { GeoOrgUnitTypeCode } from "src/v1/geo_org_unit_type_code/entities/geo_org_unit_type_code.entity";
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";

@Entity()
export class GeoOrganizationUnitCode 
{
    @ApiProperty({
        example: "DCC",
        description: "The geo organization unit code",
      })
      @PrimaryColumn()
      geo_organization_unit_code: string;

      @ApiProperty({
        example: "Open",
        description: "The complaint status code",
      })
      @OneToOne(() => GeoOrgUnitTypeCode)
      @JoinColumn()
      geo_org_unit_type_code: GeoOrgUnitTypeCode;
    
      @ApiProperty({ example: "Caribou", description: "The short description of the geo organization unit code" })
      @Column({ nullable: true })
      short_description: string;
    
      @ApiProperty({ example: "Caribou", description: "The long description of the geo organization unit code" })
      @Column({ nullable: true })
      long_description: string;

      @ApiProperty({ example: "DKM", description: "The legacy code of the geo organization unit code" })
      @Column({ nullable: true })
      legacy_code: string;
    
      @ApiProperty({ example: "2023-01-22", description: "The effective date for this geo org unit structure" })
      @Column()
      effective_date: Date;

      @ApiProperty({ example: "2023-01-22", description: "The effective date for this geo org unit structure" })
      @Column({ nullable: true })
      expiry_date: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that created the geo organization unit",
      })
      @Column()
      create_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that created the geo organization unit",
      })
      @Column()
      create_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the geo organization unit was created",
      })
      @Column()
      create_timestamp: Date;
    
      @ApiProperty({
        example: "IDIR\mburns",
        description: "The id of the user that last updated the geo organization unit",
      })
      @Column()
      update_user_id: string;
    
      @ApiProperty({
        example: "903f87c8-76dd-427c-a1bb-4d179e443252",
        description: "The unique guid of the user that last updated the geo organization unit",
      })
      @Column()
      update_user_guid: string;
    
      @ApiProperty({
        example: "2003-04-12 04:05:06",
        description: "The timestamp when the geo organization unit was last updated",
      })
      @Column()
      update_timestamp: Date;
    
      constructor() {
    
      }
}
