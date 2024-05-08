import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintStatusCodeService } from "./complaint_status_code.service";
import { ComplaintStatusCode } from "./entities/complaint_status_code.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("ComplaintStatusCodeService", () => {
  let service: ComplaintStatusCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplaintStatusCodeService,
        {
          provide: getRepositoryToken(ComplaintStatusCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ComplaintStatusCodeService>(ComplaintStatusCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
