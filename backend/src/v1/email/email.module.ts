import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { ChesModule } from "../../external_api/ches/ches.module";
import { EmailReferenceModule } from "../../v1/email_reference/email_reference.module";
import { HwcrComplaintNatureCodeModule } from "../../v1/hwcr_complaint_nature_code/hwcr_complaint_nature_code.module";
import { ViolationCodeModule } from "../../v1/violation_code/violation_code.module";
import { GirTypeCodeModule } from "../../v1/gir_type_code/gir_type_code.module";
import { CssModule } from "../../external_api/css/css.module";
import { AppUserModule } from "../../v1/app_user/app_user.module";
import { CodeTableModule } from "../../v1/code-table/code-table.module";

@Module({
  imports: [
    ChesModule,
    EmailReferenceModule,
    HwcrComplaintNatureCodeModule,
    ViolationCodeModule,
    GirTypeCodeModule,
    CssModule,
    AppUserModule,
    CodeTableModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
