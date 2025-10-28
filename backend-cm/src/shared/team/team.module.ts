import { Module } from "@nestjs/common";
import { TeamService } from "./team.service";
import { TeamResolver } from "./team.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [TeamResolver, TeamService],
})
export class TeamModule {}
