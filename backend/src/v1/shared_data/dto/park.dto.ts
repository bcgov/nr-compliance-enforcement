import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { ParkAreaDto } from "./park_area.dto";

export class ParkDto {
  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The guid for this park",
  })
  parkGuid: UUID;

  @ApiProperty({
    example: "34",
    description: "The external id for the park referencing the BC Parks API",
  })
  externalId: string;

  @ApiProperty({
    example: "Strathcona Park - Lindsay Loop",
    description: "The name of the park",
  })
  name: string;

  @ApiProperty({
    example: "Strathcona Park - Lindsay Loop",
    description: "The legal name for the park",
  })
  legalName: string;

  @ApiProperty({
    example: [
      {
        parkAreaGuid: "5b997d72-d20d-4021-adf4-2b696b34baab",
        name: "North Okanagan",
        regionName: "Okanagan",
      },
    ],
    description: "The areas for this park",
  })
  parkAreas: Array<ParkAreaDto>;
}
