import { Test, TestingModule } from '@nestjs/testing';
import { AllegationComplaintController } from './allegation_complaint.controller';
import { AllegationComplaintService } from './allegation_complaint.service';

describe("AllegationComplaintController", () => {
  let controller: AllegationComplaintController;

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
      controllers: [AllegationComplaintController],
      providers: [AllegationComplaintService],
    })
      .overrideProvider(AllegationComplaintService)
      .useValue(mockService)
      .compile();

    controller = module.get<AllegationComplaintController>(AllegationComplaintController);
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
