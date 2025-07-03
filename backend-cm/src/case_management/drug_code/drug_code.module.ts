import { Module } from "@nestjs/common";
import { DrugCodeService } from "./drug_code.service";
import { DrugCodeResolver } from "./drug_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [DrugCodeResolver, DrugCodeService],
})
export class DrugCodeModule {}
