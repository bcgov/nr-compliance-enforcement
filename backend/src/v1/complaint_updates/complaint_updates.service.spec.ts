import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ComplaintUpdatesService } from "./complaint_updates.service";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";

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
      ],
    }).compile();

    service = module.get<ComplaintUpdatesService>(ComplaintUpdatesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
