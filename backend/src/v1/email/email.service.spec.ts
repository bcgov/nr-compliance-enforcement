import { Test, TestingModule } from "@nestjs/testing";
import { EmailService } from "./email.service";
import { ChesService } from "../../external_api/ches/ches.service";
import { EmailReferenceService } from "../../v1/email_reference/email_reference.service";
import { ComplaintService } from "../../v1/complaint/complaint.service";
import { SpeciesCodeService } from "../../v1/species_code/species_code.service";
import { HwcrComplaintNatureCodeService } from "../../v1/hwcr_complaint_nature_code/hwcr_complaint_nature_code.service";
import { GeoOrganizationUnitCodeService } from "../../v1/geo_organization_unit_code/geo_organization_unit_code.service";
import { AgencyCodeService } from "../../v1/agency_code/agency_code.service";
import { ViolationCodeService } from "../../v1/violation_code/violation_code.service";
import { GirTypeCodeService } from "../../v1/gir_type_code/gir_type_code.service";
import { CssService } from "../../external_api/css/css.service";
import { OfficerService } from "../../v1/officer/officer.service";

describe("EmailService", () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ChesService,
          useValue: {},
        },
        {
          provide: EmailReferenceService,
          useValue: {},
        },
        {
          provide: ComplaintService,
          useValue: {},
        },
        {
          provide: SpeciesCodeService,
          useValue: {},
        },
        {
          provide: HwcrComplaintNatureCodeService,
          useValue: {},
        },
        {
          provide: GeoOrganizationUnitCodeService,
          useValue: {},
        },
        {
          provide: AgencyCodeService,
          useValue: {},
        },
        {
          provide: ViolationCodeService,
          useValue: {},
        },
        {
          provide: GirTypeCodeService,
          useValue: {},
        },
        {
          provide: CssService,
          useValue: {},
        },
        {
          provide: OfficerService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
