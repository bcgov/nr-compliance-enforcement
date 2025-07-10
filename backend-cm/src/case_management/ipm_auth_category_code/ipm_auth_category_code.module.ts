import { Module } from "@nestjs/common";
import { IpmAuthCategoryCodeService } from "./ipm_auth_category_code.service";
import { IpmAuthCategoryCodeResolver } from "./ipm_auth_category_code.resolver";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

@Module({
  imports: [PrismaModuleCaseManagement],
  providers: [IpmAuthCategoryCodeResolver, IpmAuthCategoryCodeService],
})
export class IpmAuthCategoryCodeModule {}
