import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "src/common/user.service";
import {
  DeactivateInvestigationAttachmentReferenceInput,
  InvestigationAttachmentReference,
} from "src/investigation/investigation_attachment_reference/dto/investigation_attachment_reference";
import { InvestigationPrismaService } from "src/prisma/investigation/prisma.investigation.service";

@Injectable()
export class InvestigationAttachmentReferenceService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    private readonly user: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async deactivate(input: DeactivateInvestigationAttachmentReferenceInput): Promise<InvestigationAttachmentReference> {
    // Soft-delete makes (party, object) non-unique over time, so find the live row first…
    const existing = await this.prisma.investigation_attachment_reference.findFirst({
      where: {
        investigation_party_guid: input.investigationPartyGuid,
        object_guid_ref: input.objectId,
        active_ind: true,
      },
    });

    if (!existing) {
      throw new NotFoundException("No active attachment reference found to deactivate");
    }

    // …then update by its PK so only that one row is ever touched.
    const updated = await this.prisma.investigation_attachment_reference.update({
      where: {
        investigation_attachment_reference_guid: existing.investigation_attachment_reference_guid,
      },
      data: {
        active_ind: false,
        update_user_id: this.user.getIdirUsername(),
        update_utc_timestamp: new Date(),
      },
    });

    return this.mapper.map(updated, "investigation_attachment_reference", "InvestigationAttachmentReference");
  }
}
