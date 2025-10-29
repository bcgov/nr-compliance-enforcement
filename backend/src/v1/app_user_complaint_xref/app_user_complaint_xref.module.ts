import { forwardRef, Module } from "@nestjs/common";
import { AppUserComplaintXrefService } from "./app_user_complaint_xref.service";
import { AppUserComplaintXrefController } from "./app_user_complaint_xref.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppUserComplaintXref } from "./entities/app_user_complaint_xref.entity";
import { ComplaintModule } from "../complaint/complaint.module";
import { EmailModule } from "../email/email.module";
import { WebeocModule } from "src/external_api/webeoc/webeoc.module";
import { AppUserModule } from "../app_user/app_user.module";
import { FeatureFlagModule } from "../feature_flag/feature_flag.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([AppUserComplaintXref]),
    forwardRef(() => ComplaintModule),
    EmailModule,
    WebeocModule,
    AppUserModule,
    FeatureFlagModule,
  ],
  controllers: [AppUserComplaintXrefController],
  providers: [AppUserComplaintXrefService],
  exports: [AppUserComplaintXrefService],
})
export class AppUserComplaintXrefModule {}
