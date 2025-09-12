import { Test, TestingModule } from "@nestjs/testing";
import { EquipmentStatusCodeService } from "./equipment_status_code.service";
import { PrismaModuleComplaintOutcome } from "../../prisma/complaint_outcome/prisma.complaint_outcome.module";

describe("EquipmentCodeService", () => {
  let service: EquipmentStatusCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModuleComplaintOutcome],
      providers: [EquipmentStatusCodeService],
    }).compile();

    service = module.get<EquipmentStatusCodeService>(EquipmentStatusCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
