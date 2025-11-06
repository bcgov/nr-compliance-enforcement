import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";

export class ParkAreaDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The guid for this park area",
  })
  parkAreaGuid: UUID;

  @ApiProperty({
    example: "North Okanagan",
    description: "The name of the park area",
  })
  name: string;

  @ApiProperty({
    example: "Okanagan",
    description: "The name of the region park area",
  })
  regionName: string;
}
