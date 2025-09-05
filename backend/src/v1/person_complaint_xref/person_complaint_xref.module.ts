import { forwardRef, Module } from "@nestjs/common";
import { PersonComplaintXrefService } from "./person_complaint_xref.service";
import { PersonComplaintXrefController } from "./person_complaint_xref.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonComplaintXref } from "./entities/person_complaint_xref.entity";
import { ComplaintModule } from "../complaint/complaint.module";
import { EmailModule } from "../email/email.module";
import { WebeocModule } from "src/external_api/webeoc/webeoc.module";
import { OfficerModule } from "../officer/officer.module";
import { FeatureFlagModule } from "../feature_flag/feature_flag.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonComplaintXref]),
    forwardRef(() => ComplaintModule),
    EmailModule,
    WebeocModule,
    OfficerModule,
    FeatureFlagModule,
  ],
  controllers: [PersonComplaintXrefController],
  providers: [PersonComplaintXrefService],
  exports: [PersonComplaintXrefService],
})
export class PersonComplaintXrefModule {}
