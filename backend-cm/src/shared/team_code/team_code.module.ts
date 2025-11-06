import { Module } from "@nestjs/common";
import { TeamCodeService } from "./team_code.service";
import { TeamCodeResolver } from "./team_code.resolver";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";

@Module({
  imports: [PrismaModuleShared],
  providers: [TeamCodeResolver, TeamCodeService],
})
export class TeamCodeModule {}
