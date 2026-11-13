import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";

export class SendInvestigationCollaboratorEmailDto {
  @ApiProperty({
    example: "c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f",
    description: "The guid of the investigation that the collaborator is being added to.",
  })
  investigationGuid: UUID;

  @ApiProperty({
    example: "https://natcom.test.gov.bc.ca/investigation/c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f",
    description: "The url of the investigation details page for the given investigation.",
  })
  investigationUrl: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The person guid for the officer",
  })
  appUserGuid: UUID;
}
