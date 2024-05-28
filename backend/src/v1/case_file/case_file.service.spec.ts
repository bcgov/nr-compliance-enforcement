import { Test, TestingModule } from "@nestjs/testing";
import { REQUEST } from "@nestjs/core";
import { AutomapperModule, getMapperToken } from "@automapper/nestjs";
import { createMapper } from "@automapper/core";
import { pojos } from "@automapper/pojos";
import { CaseFileService } from "./case_file.service";
import { ComplaintModule } from "../complaint/complaint.module";
import { ComplaintService } from "../complaint/complaint.service";

describe("Testing: Case File Service", () => {
  let service: CaseFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule, ComplaintModule],
      providers: [
        AutomapperModule,
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: pojos(),
          }),
        },
        CaseFileService,
        {
          provide: REQUEST,
          useValue: {
            user: { idir_username: "TEST" },
          },
        },
        {
          provide: ComplaintService,
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<CaseFileService>(CaseFileService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();

    const unused = null;
  });
});
