import { Module } from "@nestjs/common";
import { CaseActivityResolver } from "./case_activity.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";
import { UserModule } from "../../common/user.module";
import { CaseActivityService } from "./case_activity.service";
import { EventPublisherModule } from "../../event_publisher/event_publisher.module";

@Module({
  imports: [PrismaModuleShared, AutomapperModule, UserModule, EventPublisherModule],
  providers: [CaseActivityResolver, CaseActivityService],
  exports: [CaseActivityService],
})
export class CaseActivityModule {}
