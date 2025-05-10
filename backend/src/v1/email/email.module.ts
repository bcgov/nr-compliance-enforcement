import { Module, forwardRef } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { ChesModule } from "src/external_api/ches/ches.module";
import { DocumentModule } from "src/v1/document/document.module";
import { EmailReferenceModule } from "src/v1/email_reference/email_reference.module";
import { ComplaintModule } from "src/v1/complaint/complaint.module";
import { SpeciesCodeModule } from "src/v1/species_code/species_code.module";
import { HwcrComplaintNatureCodeModule } from "src/v1/hwcr_complaint_nature_code/hwcr_complaint_nature_code.module";
import { GeoOrganizationUnitCodeModule } from "src/v1/geo_organization_unit_code/geo_organization_unit_code.module";
import { AgencyCodeModule } from "src/v1/agency_code/agency_code.module";
import { ViolationCodeModule } from "src/v1/violation_code/violation_code.module";
import { GirTypeCodeModule } from "src/v1/gir_type_code/gir_type_code.module";

@Module({
  imports: [
    ChesModule,
    DocumentModule,
    EmailReferenceModule,
    forwardRef(() => ComplaintModule),
    SpeciesCodeModule,
    HwcrComplaintNatureCodeModule,
    GeoOrganizationUnitCodeModule,
    AgencyCodeModule,
    ViolationCodeModule,
    GirTypeCodeModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
