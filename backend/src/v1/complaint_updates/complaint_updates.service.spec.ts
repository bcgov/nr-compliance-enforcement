import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ComplaintUpdatesService } from "./complaint_updates.service";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { ComplaintReferral } from "../complaint_referral/entities/complaint_referral.entity";

describe("ConfigurationService", () => {
  let service: ComplaintUpdatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<ComplaintUpdatesService>(ComplaintUpdatesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
