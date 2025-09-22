import { Test, TestingModule } from "@nestjs/testing";
import { ActionCodeService } from "./action_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("ActionCodeService", () => {
  let service: ActionCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [ActionCodeService],
    }).compile();

    service = module.get<ActionCodeService>(ActionCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
