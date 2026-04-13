import { Test, TestingModule } from "@nestjs/testing";
import { EquipmentCodeService } from "./equipment_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("EquipmentCodeService", () => {
  let service: EquipmentCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [EquipmentCodeService],
    }).compile();

    service = await module.resolve<EquipmentCodeService>(EquipmentCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
