import { Test, TestingModule } from "@nestjs/testing";
import { ConflictHistoryCodeService } from "./conflict_history_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("ConflictHistoryCodeService", () => {
  let service: ConflictHistoryCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [ConflictHistoryCodeService],
    }).compile();

    service = module.get<ConflictHistoryCodeService>(ConflictHistoryCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
