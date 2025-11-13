import { Module, forwardRef } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { ChesModule } from "../../external_api/ches/ches.module";
import { EmailReferenceModule } from "../../v1/email_reference/email_reference.module";
import { ComplaintModule } from "../../v1/complaint/complaint.module";
import { SpeciesCodeModule } from "../../v1/species_code/species_code.module";
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
    forwardRef(() => ComplaintModule),
    SpeciesCodeModule,
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
