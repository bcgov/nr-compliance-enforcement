import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintReferralEmailLogService } from "./complaint_referral_email_log.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ComplaintReferralEmailLog } from "./entities/complaint_referral_email_log.entity";
import { Logger } from "@nestjs/common";

// Mocking the repository to avoid database interactions
const mockComplaintReferralEmailLogRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

describe("ComplaintReferralEmailLogService", () => {
  let service: ComplaintReferralEmailLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplaintReferralEmailLogService,
        {
          provide: getRepositoryToken(ComplaintReferralEmailLog),
          useValue: mockComplaintReferralEmailLogRepository,
        },
        Logger,
      ],
    }).compile();

    service = module.get<ComplaintReferralEmailLogService>(ComplaintReferralEmailLogService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
