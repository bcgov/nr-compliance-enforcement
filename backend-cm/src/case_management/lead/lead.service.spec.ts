import { Test, TestingModule } from "@nestjs/testing";
import { LeadService } from "./lead.service";
import { PrismaModuleCaseManagement } from "../../prisma/cm/prisma.cm.module";

describe("LeadService", () => {
  let service: LeadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleCaseManagement],
      providers: [LeadService],
    }).compile();

    service = module.get<LeadService>(LeadService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
