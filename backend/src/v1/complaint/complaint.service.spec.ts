import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { ComplaintService } from "./complaint.service";
import { Complaint } from "../complaint/entities/complaint.entity";
import { MockComplaintsRepository } from "../../../test/mocks/mock-complaints-repositories";
import { createWildlifeComplaintMetadata } from "src/middleware/maps/automapper-meta-data";
import { AutomapperModule, getMapperToken } from "@automapper/nestjs";
import { Mapper, createMapper } from "@automapper/core";
import { pojos } from "@automapper/pojos";

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
        ],
      }).compile();
  
      service = module.get<ComplaintService>(ComplaintService);
    });
  
    it("should be defined", () => {
      expect(service).toBeDefined();
    });

    it("should return collection of Complaints", async () => { 
      //-- arrange
      const _type = "HWCR";

      //-- act
      const results = await service.findAllByType(_type);

      //-- assert
      expect(results).not.toBe(null);
      expect(results.length).not.toBe(0);
      expect(results.length).toBe(8);
    })
});
