import { Module } from "@nestjs/common";
import { ComplaintReferralService } from "./complaint_referral.service";
import { ComplaintReferralController } from "./complaint_referral.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintReferral } from "./entities/complaint_referral.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintReferral])],
  controllers: [ComplaintReferralController],
  providers: [ComplaintReferralService],
  exports: [ComplaintReferralService],
})
export class ComplaintReferralModule {}
