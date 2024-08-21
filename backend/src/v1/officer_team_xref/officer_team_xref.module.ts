import { Module } from "@nestjs/common";
import { OfficerTeamXrefService } from "./officer_team_xref.service";
import { OfficerTeamXrefController } from "./officer_team_xref.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OfficerTeamXref } from "./entities/officer_team_xref.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OfficerTeamXref])],
  controllers: [OfficerTeamXrefController],
  providers: [OfficerTeamXrefService],
  exports: [OfficerTeamXrefService],
})
export class OfficerTeamXrefModule {}
