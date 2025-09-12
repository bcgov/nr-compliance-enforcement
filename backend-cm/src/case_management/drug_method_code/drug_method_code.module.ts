import { Module } from "@nestjs/common";
import { DrugMethodCodeService } from "./drug_method_code.service";
import { DrugMethodCodeResolver } from "./drug_method_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [DrugMethodCodeResolver, DrugMethodCodeService],
})
export class DrugMethodCodeModule {}
