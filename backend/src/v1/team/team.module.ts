import { Module } from "@nestjs/common";
import { TeamService } from "./team.service";
import { TeamController } from "./team.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Team } from "./entities/team.entity";
import { CssModule } from "src/external_api/css/css.module";
import { OfficerTeamXref } from "../officer_team_xref/entities/officer_team_xref.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Team]), TypeOrmModule.forFeature([OfficerTeamXref]), CssModule],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
