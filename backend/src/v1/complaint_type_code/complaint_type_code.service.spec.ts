import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintTypeCodeService } from "./complaint_type_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ComplaintTypeCode } from "./entities/complaint_type_code.entity";

describe("ComplaintTypeCodeService", () => {
  let service: ComplaintTypeCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplaintTypeCodeService,
        {
          provide: getRepositoryToken(ComplaintTypeCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ComplaintTypeCodeService>(ComplaintTypeCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
