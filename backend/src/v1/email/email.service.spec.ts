import { Test, TestingModule } from "@nestjs/testing";
import { EmailService } from "./email.service";
import { ChesService } from "../../external_api/ches/ches.service";
import { EmailReferenceService } from "../../v1/email_reference/email_reference.service";
import { ComplaintService } from "../../v1/complaint/complaint.service";
import { HwcrComplaintNatureCodeService } from "../../v1/hwcr_complaint_nature_code/hwcr_complaint_nature_code.service";
import { ViolationCodeService } from "../../v1/violation_code/violation_code.service";
import { GirTypeCodeService } from "../../v1/gir_type_code/gir_type_code.service";
import { CssService } from "../../external_api/css/css.service";
import { AppUserService } from "../../v1/app_user/app_user.service";
import { CodeTableService } from "../code-table/code-table.service";
import { FeatureFlagService } from "../../v1/feature_flag/feature_flag.service";
import { ChefsService } from "../../external_api/chefs/chefs.service";

jest.mock("../../external_api/shared_data", () => {
  const { createSharedDataMocks } = require("../../../test/mocks/external_api/mock-shared-data");
  return createSharedDataMocks();
});

import {
  mockGetCosCommunityWithApiKey,
  mockGetParkNameWithApiKey,
  resetSharedDataMocks,
} from "../../../test/mocks/external_api/mock-shared-data";

describe("EmailService", () => {
  let service: EmailService;
  let chesService: { sendEmail: jest.Mock };
  let emailReferenceService: { findActiveByAgency: jest.Mock };
  let chefsService: { getFile: jest.Mock };

  beforeEach(async () => {
    resetSharedDataMocks();
    chesService = { sendEmail: jest.fn().mockResolvedValue({}) };
    emailReferenceService = { findActiveByAgency: jest.fn().mockResolvedValue([]) };
    chefsService = { getFile: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ChesService,
          useValue: chesService,
        },
        {
          provide: EmailReferenceService,
          useValue: emailReferenceService,
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
        {
          provide: FeatureFlagService,
          useValue: {},
        },
        {
          provide: ChefsService,
          useValue: chefsService,
        },
      ],
    }).compile();

    service = await module.resolve<EmailService>(EmailService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("sendNewComplaintNotification", () => {
    const MB = 1024 * 1024;
    const notification = {
      complaintId: "26-800000",
      complaintType: "ERS",
      agencyCode: "COS",
      communityCode: "100MHHS",
      submission: { cos_area_community: "100 Mile House", cos_call_details: "Saw something" },
    };

    const sentEmail = () => {
      const [from, fromName, subject, body, to, cc, attachments, tag] = chesService.sendEmail.mock.calls[0];
      return { from, fromName, subject, body, to, cc, attachments, tag };
    };

    beforeEach(() => {
      process.env.CEDS_EMAIL = "support@gov.bc.ca";
      process.env.NATSUITE_URL = "https://natsuite.example.ca";
      process.env.ENVIRONMENT = "prod";
      delete process.env.CHEFS_EMAIL_ATTACHMENT_LIMIT_MB;
      emailReferenceService.findActiveByAgency.mockResolvedValue([{ email_address: "cos@gov.bc.ca" }]);
    });

    it("emails the agency and zone addresses for the complaint's community", async () => {
      mockGetCosCommunityWithApiKey.mockResolvedValue({
        areaCode: "100MHHS",
        areaName: "100 Mile House",
        zoneCode: "CRBOTMPSN",
      });
      emailReferenceService.findActiveByAgency.mockResolvedValue([
        { email_address: "cariboo@gov.bc.ca", geo_organization_unit_code: "CRBOTMPSN" },
        { email_address: "kootenay@gov.bc.ca", geo_organization_unit_code: "EKTNY" },
      ]);

      const recipients = await service.sendNewComplaintNotification(notification);

      expect(emailReferenceService.findActiveByAgency).toHaveBeenCalledWith("COS");
      expect(recipients).toEqual(["cariboo@gov.bc.ca"]);
      const email = sentEmail();
      expect(email.from).toBe("support@gov.bc.ca");
      expect(email.fromName).toBe("NatSuite");
      expect(email.subject).toBe("New Enforcement complaint #26-800000 (100 Mile House)");
      expect(email.body).toContain('href="https://natsuite.example.ca/complaint/ERS/26-800000"');
      expect(email.body).toContain("Saw something");
      expect(email.to).toEqual(["cariboo@gov.bc.ca"]);
      expect(email.attachments).toEqual([]);
      expect(email.tag).toBe("new_complaint");
    });
  });
});
