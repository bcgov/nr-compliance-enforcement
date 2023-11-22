import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { ComplaintService } from "./complaint.service";
import { Complaint } from "../complaint/entities/complaint.entity";
import { MockComplaintsRepository } from "../../../test/mocks/mock-complaints-repositories";

describe("Testing: Complaint Service", () => {
   let service: ComplaintService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
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
