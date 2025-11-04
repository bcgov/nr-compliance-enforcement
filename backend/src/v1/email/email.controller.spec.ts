import { Test, TestingModule } from "@nestjs/testing";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";
import { ChesService } from "../../external_api/ches/ches.service";
import { DocumentService } from "../../v1/document/document.service";
import { EmailReferenceService } from "../../v1/email_reference/email_reference.service";
import { ComplaintService } from "../../v1/complaint/complaint.service";
import { SpeciesCodeService } from "../../v1/species_code/species_code.service";
import { HwcrComplaintNatureCodeService } from "../../v1/hwcr_complaint_nature_code/hwcr_complaint_nature_code.service";
import { ViolationCodeService } from "../../v1/violation_code/violation_code.service";
import { GirTypeCodeService } from "../../v1/gir_type_code/gir_type_code.service";
import { CssService } from "../../external_api/css/css.service";
import { AppUserService } from "../../v1/app_user/app_user.service";
import { CodeTableService } from "../code-table/code-table.service";

jest.mock("../../external_api/shared_data", () => {
  const { createSharedDataMocks } = require("../../../test/mocks/external_api/mock-shared-data");
  return createSharedDataMocks();
});

import { resetSharedDataMocks } from "../../../test/mocks/external_api/mock-shared-data";

describe("EmailController", () => {
  let controller: EmailController;

  beforeEach(async () => {
    resetSharedDataMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        EmailService,
        {
          provide: ChesService,
          useValue: {},
        },
        {
          provide: DocumentService,
          useValue: {},
        },
        {
          provide: EmailReferenceService,
          useValue: {},
        },
        {
          provide: CodeTableService,
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
          provide: AppUserService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
