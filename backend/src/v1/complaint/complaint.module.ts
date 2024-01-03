import { Module } from "@nestjs/common";
import { ComplaintController } from "./complaint.controller";
import { ComplaintService } from "./complaint.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Complaint } from "../complaint/entities/complaint.entity";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { Office } from "../office/entities/office.entity";
import { Officer } from "../officer/entities/officer.entity";
import { ReportedByCode } from "../reported_by_code/entities/reported_by_code.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint]),
    TypeOrmModule.forFeature([HwcrComplaint]),
    TypeOrmModule.forFeature([AllegationComplaint]),
    TypeOrmModule.forFeature([AgencyCode]),
    TypeOrmModule.forFeature([Office]),
    TypeOrmModule.forFeature([Officer]),
    TypeOrmModule.forFeature([ReportedByCode]),
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
