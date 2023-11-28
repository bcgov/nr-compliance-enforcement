import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { ComplaintService } from "./complaint.service";
import { Complaint } from "../complaint/entities/complaint.entity";
import { MockComplaintsRepository } from "../../../test/mocks/mock-complaints-repositories";
import { createWildlifeComplaintMetadata } from "../../middleware/maps/automapper-meta-data";
import { AutomapperModule, getMapperToken } from "@automapper/nestjs";
import { Mapper, createMapper } from "@automapper/core";
import { pojos } from "@automapper/pojos";
import { HwcrComplaint } from "../hwcr_complaint/entities/hwcr_complaint.entity";
import { AllegationComplaint } from "../allegation_complaint/entities/allegation_complaint.entity";
import { MockAllegationComplaintRepository  } from "../../../test/mocks/mock-allegation-complaint-repository";
import { MockWildlifeConflictComplaintRepository } from "../../../test/mocks/mock-wildlife-conflict-complaint-repository";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { Officer } from "../officer/entities/officer.entity";
import { Office } from "../office/entities/office.entity";

describe("Testing: Complaint Service", () => {
   let service: ComplaintService;
   let mapper: Mapper;

   createWildlifeComplaintMetadata();

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [AutomapperModule],
        providers: [
          AutomapperModule,
          {
            provide: getMapperToken(),
            useValue: createMapper({
              strategyInitializer: pojos(),
            }),
          },
          ComplaintService,
          {
            provide: getRepositoryToken(Complaint),
            useFactory: MockComplaintsRepository,
          },
          {
            provide: getRepositoryToken(AllegationComplaint),
            useFactory: MockAllegationComplaintRepository
          },
          {
            provide: getRepositoryToken(HwcrComplaint),
            useFactory: MockWildlifeConflictComplaintRepository
          },

          {
            provide: getRepositoryToken(AgencyCode),
            useFactory: MockWildlifeConflictComplaintRepository
          },
          {
            provide: getRepositoryToken(Officer),
            useFactory: MockWildlifeConflictComplaintRepository
          },
          {
            provide: getRepositoryToken(Office),
            useFactory: MockWildlifeConflictComplaintRepository
          },
        ],
      }).compile();
  
      service = module.get<ComplaintService>(ComplaintService);
    });
  
    it("should be defined", () => {
      expect(service).toBeDefined();
    });

    it("should return collection of HWCR Complaints", async () => { 
      //-- arrange
      const _type = "HWCR";

      //-- act
      const results = await service.findAllByType(_type);

      //-- assert
      expect(results).not.toBe(null);
      expect(results.length).not.toBe(0);
      expect(results.length).toBe(5);
    })

    it("should return collection of ERS Complaints", async () => { 
      //-- arrange
      const _type = "ERS";

      //-- act
      const results = await service.findAllByType(_type);

      //-- assert
      expect(results).not.toBe(null);
      expect(results.length).not.toBe(0);
      expect(results.length).toBe(5);
    })
});

