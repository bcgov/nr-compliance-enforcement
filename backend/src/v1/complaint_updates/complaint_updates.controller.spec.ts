import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintUpdatesController } from "./complaint_updates.controller";
import { ComplaintUpdatesService } from "./complaint_updates.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { ComplaintReferral } from "../complaint_referral/entities/complaint_referral.entity";
import { ComplaintReferralEmailLogService } from "../complaint_referral_email_log/complaint_referral_email_log.service";
import { ComplaintReferralEmailLog } from "../complaint_referral_email_log/entities/complaint_referral_email_log.entity";
import { MockComplaintReferralEmailLogRepository } from "../../../test/mocks/mock-complaints-repositories";

describe("ComplaintUpdatesController", () => {
  let controller: ComplaintUpdatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintUpdatesController],
      providers: [
        ComplaintUpdatesService,
        {
          provide: getRepositoryToken(ComplaintUpdate),
          useValue: {},
        },
        {
          provide: getRepositoryToken(StagingComplaint),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ActionTaken),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ComplaintReferral),
          useValue: {},
        },
        ComplaintReferralEmailLogService,
        {
          provide: getRepositoryToken(ComplaintReferralEmailLog),
          useValue: MockComplaintReferralEmailLogRepository,
        },
      ],
    }).compile();

    controller = module.get<ComplaintUpdatesController>(ComplaintUpdatesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
