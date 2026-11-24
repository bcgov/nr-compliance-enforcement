import { Module } from "@nestjs/common";
import { StagingComplaintService } from "./staging_complaint.service";
import { StagingComplaintController } from "./staging_complaint.controller";
import { StagingComplaint } from "./entities/staging_complaint.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Complaint } from "../complaint/entities/complaint.entity";
import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([StagingComplaint]),
    TypeOrmModule.forFeature([Complaint]),
    TypeOrmModule.forFeature([ComplaintUpdate]),
    EmailModule,
  ],
  controllers: [StagingComplaintController],
  providers: [StagingComplaintService],
  exports: [StagingComplaintService],
})
export class StagingComplaintModule {}
