import { ApiProperty } from "@nestjs/swagger";
import { ViewEntity, Column, PrimaryColumn } from "typeorm";

@ViewEntity("cos_geo_org_unit_flat_mvw")
export class CosGeoOrgUnit {
  @ApiProperty({ example: "KTNY", description: "Human readable region code" })
  @Column("character varying", { name: "region_code", length: 10 })
  region_code: string;

  @ApiProperty({
    example: "Kootenay",
    description: "Short description of the region code",
  })
  @Column("character varying", { name: "region_name", length: 50 })
  region_name: string;

  @ApiProperty({
    example: "CLMBAKTNY",
    description: "Human readable zone code",
  })
  @Column("character varying", { name: "zone_code", length: 10 })
  zone_code: string;

  @ApiProperty({
    example: "Columbia/Kootenay",
    description: "Short description of the zone name",
  })
  @Column("character varying", { name: "zone_name", length: 50 })
  zone_name: string;

  @ApiProperty({ example: "GLDN", description: "Human readable region code" })
  @Column("character varying", { name: "offloc_code", length: 10 })
  office_location_code: string;

  @ApiProperty({ example: "Golden", description: "Human readable region code" })
  @Column("character varying", { name: "offloc_name", length: 50 })
  office_location_name: string;

  @ApiProperty({ example: "BLBRY", description: "Human readable region code" })
  @PrimaryColumn("character varying", { name: "area_code", length: 10 })
  area_code: string;

  @ApiProperty({
    example: "Blaeberry",
    description: "Human readable region code",
  })
  @Column("character varying", { name: "area_name", length: 50 })
  area_name: string;

  @ApiProperty({
    example: "True",
    description: "Indicates if the unit is a COSHQ Office.",
  })
  @Column("boolean", { name: "administrative_office_ind" })
  administrative_office_ind: boolean;

  constructor(zone_code: string) {
    this.zone_code = zone_code;
  }
}
