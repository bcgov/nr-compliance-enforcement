import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { OfficeService } from "./office.service";
import { Office } from "./entities/office.entity";

import { MockOfficeRepository } from "../../../test/mocks/mock-office-repository";
import { dataSourceMockFactory } from "../../../test/mocks/datasource";
import { UUID } from "crypto";
import { CreateOfficeDto } from "./dto/create-office.dto";

describe("Testing: OfficeService", () => {
  let service: OfficeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfficeService,
        {
          provide: getRepositoryToken(Office),
          useFactory: MockOfficeRepository,
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

    service = module.get<OfficeService>(OfficeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should find office by id: uuid", async () => {
    const officeId: UUID = "2044f08d-b53c-489a-8584-dd867b63514a";
    const orgUnit = "CRSTN";

    const result = await service.findOne(officeId);

    expect(result).not.toBe(null);

    const { office_guid: id, cos_geo_org_unit: unit } = result;

    expect(id).toBe(officeId);
    expect(unit).toBe(orgUnit);
  });

  it("should return collection of offices by zone", async () => {
    const _zone = "NCHKOLKS";
    const _id = "5128179c-f622-499b-b8e5-b39199081f22";
    const _zone_code = "NCHKOLKS";
    const _region_code = "OMINECA";
    const _officeLocation = "VNDHF";
    const _area_code = "VANDERHF";

    const results = await service.findOfficesByZone(_zone);

    expect(results).not.toBe(null);
    expect(results.length).toBe(2);

    const item = results[1];
    const {
      office_guid: id,
      cos_geo_org_unit: { zone_code, region_code, office_location_code: officeLocation, area_code },
      officers,
    } = item;

    expect(id).toBe(_id);
    expect(zone_code).toBe(_zone_code);
    expect(region_code).toBe(_region_code);
    expect(officeLocation).toBe(_officeLocation);
    expect(area_code).toBe(_area_code);

    expect(officers.length).toBe(1);
  });

  it("should return collection of offices by geo-location-code", async () => {
    const _id = "313f4ec3-e88a-41c2-9956-78c7b18cb71d";
    const _unit = "QSNL";

    const results: any = await service.findByGeoOrgCode(_unit);

    expect(results).not.toBe(null);
    const { office_guid: id, cos_geo_org_unit: unit } = results;

    expect(id).toBe(_id);
    expect(unit).toBe(_unit);
  });

  it("should create a new office record or throw an error", async () => {
    const payload: CreateOfficeDto = {
      geo_organization_unit_code: "TEST",
      agency_code_ref: "TEST",
      create_user_id: "MSEARS",
      update_user_id: "MSEARS",
      create_utc_timestamp: new Date(),
      update_utc_timestamp: new Date(),
    };

    let response = await service.create(payload);
    expect(response).not.toBe(null);

    console.log(response);

    const { create_user_id, update_user_id, agency_code_ref, office_guid } = response;
    expect(create_user_id).toBe("TEST");
    expect(update_user_id).toBe("TEST");
    expect(agency_code_ref).toBe("COS");
    expect(office_guid).not.toBe(null);

    response = await service.create(payload);
    expect(response).toThrowError;
  });
});
