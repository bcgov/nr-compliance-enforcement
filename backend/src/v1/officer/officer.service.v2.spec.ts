import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { UUID } from "crypto";

import { OfficerService } from "./officer.service";
import { Officer } from "./entities/officer.entity";

import { MockOfficerRepository } from "../../../test/mocks/mock-officer-repository";
import { MockOfficeRepository } from "../../../test/mocks/mock-office-repository";
import { PersonRepositoryMockFactory } from "../../../test/mocks/personRepositoryMockFactory";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { PersonService } from "../person/person.service";
import { Person } from "../person/entities/person.entity";
import { OfficeService } from "../office/office.service";
import { Office } from "../office/entities/office.entity";


describe("Testing: OfficerService", () => {
   let service: OfficerService;
   let dataSource: DataSource;
 
   beforeEach(async () => {
     const module: TestingModule = await Test.createTestingModule({
       providers: [
         OfficerService,
         {
           provide: getRepositoryToken(Officer),
           useFactory: MockOfficerRepository,
         },
         PersonService,
         {
           provide: getRepositoryToken(Person),
           useFactory: PersonRepositoryMockFactory
         },
         OfficeService,
         {
           provide: getRepositoryToken(Office),
           useFactory: MockOfficeRepository
         },
         {
           provide: DataSource,
           useFactory: dataSourceMockFactory,
         },
       ],
     })
       .compile()
       .catch((err) => {
         // Helps catch ninja like errors from compilation-*groa
         console.error("ERROR!", err);
         throw err;
       });
 
     service = module.get<OfficerService>(OfficerService);
     dataSource = module.get<DataSource>(DataSource);
   });
 
   it("should be defined", () => {
     expect(service).toBeDefined();
   });
 
 });
 