import { ApiProperty } from "@nestjs/swagger";
import { PrimaryColumn } from "typeorm";

export class CosGeoOrgUnitDto {
    @ApiProperty({ example: "KTNY", description: "Human readable region code"})
    region_code: string

    @ApiProperty({ example: "Kootenay", description: "Short description of the region code" })
    region_name: string;
  
    @ApiProperty({ example: "CLMBAKTNY", description: "Human readable zone code" })
    zone_code: string;
  
    @ApiProperty({ example: "Columbia/Kootenay", description: "Short description of the zone name" })
    zone_name: string;
  
    @ApiProperty({ example: "GLDN", description: "Human readable region code" })
    offloc_code: string;
  
    @ApiProperty({ example: "Golden", description: "Human readable region code" })
    offloc_name: string;
  
    @ApiProperty({ example: "BLBRY", description: "Human readable region code" })
    @PrimaryColumn({ length: 10 })
    area_code: string;
  
    @ApiProperty({ example: "Blaeberry", description: "Human readable region code" })
    area_name: string;
  }
