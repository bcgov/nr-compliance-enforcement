import { Test, TestingModule } from "@nestjs/testing";
import { LeadService } from "./lead.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("LeadService", () => {
  let service: LeadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [LeadService],
    }).compile();

    service = module.get<LeadService>(LeadService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
