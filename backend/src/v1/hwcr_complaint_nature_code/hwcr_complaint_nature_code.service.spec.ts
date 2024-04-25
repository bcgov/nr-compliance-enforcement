import { Test, TestingModule } from "@nestjs/testing";
import { HwcrComplaintNatureCodeService } from "./hwcr_complaint_nature_code.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { HwcrComplaintNatureCode } from "./entities/hwcr_complaint_nature_code.entity";

describe("HwcrComplaintNatureCodeService", () => {
  let service: HwcrComplaintNatureCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HwcrComplaintNatureCodeService,
        {
          provide: getRepositoryToken(HwcrComplaintNatureCode),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<HwcrComplaintNatureCodeService>(HwcrComplaintNatureCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
