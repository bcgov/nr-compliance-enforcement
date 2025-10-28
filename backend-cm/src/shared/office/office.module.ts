import { Module } from "@nestjs/common";
import { OfficeService } from "./office.service";
import { OfficeResolver } from "./office.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [OfficeResolver, OfficeService],
})
export class OfficeModule {}
