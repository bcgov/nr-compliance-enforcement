import { Module } from "@nestjs/common";
import { UserModule } from "src/common/user.module";
import { InvestigationAttachmentReferenceResolver } from "src/investigation/investigation_attachment_reference/investigation_attachment_reference.resolver";
import { InvestigationAttachmentReferenceService } from "src/investigation/investigation_attachment_reference/investigation_attachment_reference.service";
import { PrismaModuleInvestigation } from "src/prisma/investigation/prisma.investigation.module";

@Module({
  imports: [PrismaModuleInvestigation, UserModule],
  providers: [InvestigationAttachmentReferenceResolver, InvestigationAttachmentReferenceService],
  exports: [InvestigationAttachmentReferenceService],
})
export class InvestigationAttachmentReferenceModule {}
