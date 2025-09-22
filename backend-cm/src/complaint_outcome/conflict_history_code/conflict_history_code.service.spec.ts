import { Test, TestingModule } from "@nestjs/testing";
import { ConflictHistoryCodeService } from "./conflict_history_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("ConflictHistoryCodeService", () => {
  let service: ConflictHistoryCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [ConflictHistoryCodeService],
    }).compile();

    service = module.get<ConflictHistoryCodeService>(ConflictHistoryCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
