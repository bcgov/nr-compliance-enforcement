import { Module } from "@nestjs/common";
import { ConflictHistoryCodeService } from "./conflict_history_code.service";
import { ConflictHistoryCodeResolver } from "./conflict_history_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [ConflictHistoryCodeResolver, ConflictHistoryCodeService],
})
export class ConflictHistoryCodeModule {}
