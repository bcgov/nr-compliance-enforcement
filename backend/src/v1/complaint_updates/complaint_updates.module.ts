import { Module } from "@nestjs/common";
import { ComplaintUpdatesService } from "./complaint_updates.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintUpdatesController } from "./complaint_updates.controller";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { ComplaintReferral } from "../complaint_referral/entities/complaint_referral.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ComplaintUpdate]),
    TypeOrmModule.forFeature([StagingComplaint]),
    TypeOrmModule.forFeature([ActionTaken]),
    TypeOrmModule.forFeature([ComplaintReferral]),
  ],
  controllers: [ComplaintUpdatesController],
  providers: [ComplaintUpdatesService],
  exports: [ComplaintUpdatesService],
})
export class ComplaintUpdatesModule {}
