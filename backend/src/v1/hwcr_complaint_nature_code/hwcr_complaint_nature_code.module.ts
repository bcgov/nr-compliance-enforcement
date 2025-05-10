import { Module } from "@nestjs/common";
import { HwcrComplaintNatureCodeService } from "./hwcr_complaint_nature_code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HwcrComplaintNatureCode } from "./entities/hwcr_complaint_nature_code.entity";

@Module({
  imports: [TypeOrmModule.forFeature([HwcrComplaintNatureCode])],
  controllers: [],
  providers: [HwcrComplaintNatureCodeService],
  exports: [HwcrComplaintNatureCodeService],
})
export class HwcrComplaintNatureCodeModule {}
