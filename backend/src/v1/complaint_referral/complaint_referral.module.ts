import { forwardRef, Module } from "@nestjs/common";
import { ComplaintReferralService } from "./complaint_referral.service";
import { ComplaintReferralController } from "./complaint_referral.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintReferral } from "./entities/complaint_referral.entity";
import { Complaint } from "../complaint/entities/complaint.entity";
import { AppUserComplaintXrefModule } from "../app_user_complaint_xref/app_user_complaint_xref.module";
import { ComplaintModule } from "../complaint/complaint.module";
import { EmailModule } from "../../v1/email/email.module";
import { FeatureFlagModule } from "../../v1/feature_flag/feature_flag.module";
import { DocumentModule } from "../../v1/document/document.module";
import { ComplaintReferralEmailLogModule } from "../complaint_referral_email_log/complaint_referral_email_log.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ComplaintReferral, Complaint]),
    AppUserComplaintXrefModule,
    ComplaintReferralEmailLogModule,
    EmailModule,
    forwardRef(() => ComplaintModule),
    FeatureFlagModule,
    DocumentModule,
  ],
  controllers: [ComplaintReferralController],
  providers: [ComplaintReferralService],
  exports: [ComplaintReferralService],
})
export class ComplaintReferralModule {}
