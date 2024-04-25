import { Test, TestingModule } from "@nestjs/testing";
import { StagingComplaintService } from "./staging_complaint.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { StagingComplaint } from "./entities/staging_complaint.entity";

describe("StagingComplaintService", () => {
  let service: StagingComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StagingComplaintService,
        {
          provide: getRepositoryToken(StagingComplaint),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StagingComplaintService>(StagingComplaintService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
