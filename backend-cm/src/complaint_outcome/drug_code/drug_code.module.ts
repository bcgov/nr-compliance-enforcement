import { Module } from "@nestjs/common";
import { DrugCodeService } from "./drug_code.service";
import { DrugCodeResolver } from "./drug_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [DrugCodeResolver, DrugCodeService],
})
export class DrugCodeModule {}
