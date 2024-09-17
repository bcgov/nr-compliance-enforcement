import { Module } from "@nestjs/common";
import { ScheduleSectorXrefService } from "./schedule_sector_xref.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleSectorXref } from "./entities/schedule_sector_xref.entity";
import { ScheduleSectorXrefController } from "./schedule_sector_xref.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleSectorXref])],
  providers: [ScheduleSectorXrefService],
  controllers: [ScheduleSectorXrefController],
})
export class ScheduleSectorXrefModule {}
