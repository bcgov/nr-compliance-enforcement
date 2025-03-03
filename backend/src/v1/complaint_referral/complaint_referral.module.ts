import { Module } from "@nestjs/common";
import { ComplaintReferralService } from "./complaint_referral.service";
import { ComplaintReferralController } from "./complaint_referral.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintReferral } from "./entities/complaint_referral.entity";
import { Complaint } from "../complaint/entities/complaint.entity";
import { PersonComplaintXrefModule } from "../person_complaint_xref/person_complaint_xref.module";
import { ComplaintModule } from "../complaint/complaint.module";

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintReferral, Complaint]), PersonComplaintXrefModule, ComplaintModule],
  controllers: [ComplaintReferralController],
  providers: [ComplaintReferralService],
  exports: [ComplaintReferralService],
})
export class ComplaintReferralModule {}
