import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventResolver } from "./event.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { PaginationModule } from "../../common/pagination.module";
import { UserModule } from "../../common/user.module";

@Module({
  imports: [PrismaModuleShared, PaginationModule, UserModule],
  providers: [EventService, EventResolver],
  exports: [EventService],
})
export class EventModule {}
