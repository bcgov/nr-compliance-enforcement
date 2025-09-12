import { Module } from "@nestjs/common";
import { IpmAuthCategoryCodeService } from "./ipm_auth_category_code.service";
import { IpmAuthCategoryCodeResolver } from "./ipm_auth_category_code.resolver";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

@Module({
  imports: [PrismaModuleComplaintOutcome],
  providers: [IpmAuthCategoryCodeResolver, IpmAuthCategoryCodeService],
})
export class IpmAuthCategoryCodeModule {}
