import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "node:crypto";
import { COMPLAINT_TYPE } from "../../../types/models/complaints/complaint-type";

export class SendCollaboratorEmalDto {
  @ApiProperty({
    example: "ERS",
    description: "The type of complaint that the collaborator is being added to.",
  })
  public complaintType: COMPLAINT_TYPE;

  @ApiProperty({
    example: "https://natcom.test.gov.bc.ca/complaint/HWCR/25-000062",
    description: "The url of the complaint details page for the given complaint.",
  })
  complaintUrl: string;

  @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The person guid for the officer",
  })
  appUserGuid: UUID;
}
