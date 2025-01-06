import { Module } from "@nestjs/common";
import { OfficerService } from "./officer.service";
import { PersonService } from "../person/person.service";
import { OfficeService } from "../office/office.service";
import { OfficerController } from "./officer.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Officer } from "./entities/officer.entity";
import { Person } from "../person/entities/person.entity";
import { Office } from "../office/entities/office.entity";
import { CssModule } from "../../external_api/css/css.module";
import { TeamService } from "src/v1/team/team.service";
import { Team } from "src/v1/team/entities/team.entity";
import { OfficerTeamXref } from "src/v1/officer_team_xref/entities/officer_team_xref.entity";
import { OfficerTeamXrefService } from "src/v1/officer_team_xref/officer_team_xref.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Officer]),
    TypeOrmModule.forFeature([Person]),
    TypeOrmModule.forFeature([Office]),
    TypeOrmModule.forFeature([Team]),
    TypeOrmModule.forFeature([OfficerTeamXref]),
    CssModule,
  ],
  controllers: [OfficerController],
  providers: [OfficerService, PersonService, OfficeService, TeamService, OfficerTeamXrefService],
  exports: [OfficerService],
})
export class OfficerModule {}
