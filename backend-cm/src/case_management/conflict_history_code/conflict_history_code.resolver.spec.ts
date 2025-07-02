import { Test, TestingModule } from "@nestjs/testing";
import { ConflictHistoryCodeResolver } from "./conflict_history_code.resolver";
import { ConflictHistoryCodeService } from "./conflict_history_code.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("ConflictHistoryCodeResolver", () => {
  let resolver: ConflictHistoryCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [ConflictHistoryCodeResolver, ConflictHistoryCodeService],
    }).compile();

    resolver = module.get<ConflictHistoryCodeResolver>(ConflictHistoryCodeResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
