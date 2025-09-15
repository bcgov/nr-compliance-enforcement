import { Module } from "@nestjs/common";
import { PartyResolver } from "./party.resolver";
import { PartyService } from "./party.service";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";
import { PaginationModule } from "../../common/pagination.module";
import { UserModule } from "../../common/user.module";

@Module({
  imports: [PrismaModuleShared, AutomapperModule, PaginationModule, UserModule],
  providers: [PartyResolver, PartyService],
})
export class PartyModule {}
