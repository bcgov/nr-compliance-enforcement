import { Module } from "@nestjs/common";
import { ConflictHistoryCodeService } from "./conflict_history_code.service";
import { ConflictHistoryCodeResolver } from "./conflict_history_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [ConflictHistoryCodeResolver, ConflictHistoryCodeService],
})
export class ConflictHistoryCodeModule {}
