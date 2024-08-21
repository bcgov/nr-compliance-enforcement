import { Module } from "@nestjs/common";
import { TeamCodeService } from "./team_code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamCode } from "./entities/team_code.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TeamCode])],
  providers: [TeamCodeService],
})
export class TeamCodeModule {}
