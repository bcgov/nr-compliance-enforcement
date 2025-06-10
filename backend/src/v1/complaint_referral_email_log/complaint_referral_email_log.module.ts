import { Module } from "@nestjs/common";
import { ComplaintReferralEmailLogService } from "./complaint_referral_email_log.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintReferral } from "../complaint_referral/entities/complaint_referral.entity";
import { ComplaintReferralEmailLog } from "./entities/complaint_referral_email_log.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintReferralEmailLog]), ComplaintReferral],
  providers: [ComplaintReferralEmailLogService],
  exports: [ComplaintReferralEmailLogService],
})
export class ComplaintReferralEmailLogModule {}
