import { Module } from "@nestjs/common";
import { ScheduleSectorXrefService } from "./schedule_sector_xref.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleSectorXref } from "./entities/schedule_sector_xref.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleSectorXref])],
  providers: [ScheduleSectorXrefService],
})
export class ScheduleSectorXrefModule {}
