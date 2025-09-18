import { Module } from "@nestjs/common";
import { LegalDocumentService } from "./legal_document.service";
import { LegalDocumentNodeResolver, LegalDocumentResolver } from "./legal_document.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [LegalDocumentService, LegalDocumentResolver, LegalDocumentNodeResolver],
})
export class LegalDocumentModule {}
