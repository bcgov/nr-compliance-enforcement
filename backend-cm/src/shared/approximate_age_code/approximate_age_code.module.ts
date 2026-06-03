import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { ApproximateAgeCodeResolver } from "src/shared/approximate_age_code/approximate_age_code.resolver";
import { ApproximateAgeCodeService } from "src/shared/approximate_age_code/approximate_age_code.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [ApproximateAgeCodeResolver, ApproximateAgeCodeService],
})
export class ApproximateAgeCodeModule {}
