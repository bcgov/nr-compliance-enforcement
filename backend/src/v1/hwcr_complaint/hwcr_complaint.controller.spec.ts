import { Test, TestingModule } from "@nestjs/testing";
import { HwcrComplaintController } from "./hwcr_complaint.controller";
import { HwcrComplaintService } from "./hwcr_complaint.service";

describe("HwcrComplaintController", () => {
  let controller: HwcrComplaintController;

  const mockService = {
    getZoneAtAGlanceStatistics: jest.fn(zone => { 
      return { 
        total: 0,
        assigned: 0,
        unassigned: 0
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HwcrComplaintController],
      providers: [HwcrComplaintService],
    })
      .overrideProvider(HwcrComplaintService)
      .useValue(mockService)
      .compile();

    controller = module.get<HwcrComplaintController>(HwcrComplaintController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return zone at a glance stats", () => { 
    const userZone = "CLMBAKTNY";

    expect(controller.statsByZone(userZone)).toEqual({
      total: expect.any(Number),
      assigned: expect.any(Number),
      unassigned: expect.any(Number)
    })
  })
});
