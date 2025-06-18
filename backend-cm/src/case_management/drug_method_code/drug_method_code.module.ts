import { Module } from "@nestjs/common";
import { DrugMethodCodeService } from "./drug_method_code.service";
import { DrugMethodCodeResolver } from "./drug_method_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [DrugMethodCodeResolver, DrugMethodCodeService],
})
export class DrugMethodCodeModule {}
