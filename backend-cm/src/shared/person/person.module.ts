import { Module } from "@nestjs/common";
import { PersonService } from "./person.service";
import { PersonResolver } from "./person.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { AutomapperModule } from "@automapper/nestjs";

@Module({
  imports: [PrismaModuleShared, AutomapperModule],
  providers: [PersonResolver, PersonService],
})
export class PersonModule {}
