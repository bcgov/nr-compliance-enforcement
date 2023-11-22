import { Module } from "@nestjs/common";
import { ComplaintController } from "./complaint.controller";
import { ComplaintService } from "./complaint.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Complaint } from "../complaint/entities/complaint.entity";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint]),
    TypeOrmModule.forFeature([HwcrComplaint]),
    TypeOrmModule.forFeature([AllegationComplaint]),
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
