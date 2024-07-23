import { Module } from "@nestjs/common";
import { ComplaintUpdatesService } from "./complaint_updates.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintUpdatesController } from "./complaint_updates.controller";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintUpdate]), TypeOrmModule.forFeature([StagingComplaint])],
  controllers: [ComplaintUpdatesController],
  providers: [ComplaintUpdatesService],
  exports: [ComplaintUpdatesService],
})
export class ComplaintUpdatesModule {}
