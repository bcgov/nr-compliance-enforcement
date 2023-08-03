import { Test, TestingModule } from '@nestjs/testing';
import { AllegationComplaintService } from './allegation_complaint.service';
import { DataSource, Repository } from 'typeorm';
import { AllegationComplaint } from './entities/allegation_complaint.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Complaint } from '../complaint/entities/complaint.entity';
import { AgencyCode } from '../agency_code/entities/agency_code.entity';
import { ComplaintStatusCode } from '../complaint_status_code/entities/complaint_status_code.entity';
import { GeoOrganizationUnitCode } from '../geo_organization_unit_code/entities/geo_organization_unit_code.entity';
import { ViolationCode } from '../violation_code/entities/violation_code.entity';
import { ComplaintService } from '../complaint/complaint.service';
import { MockType, dataSourceMockFactory } from '../../../test/mocks/datasource';
import { CosGeoOrgUnit } from '../cos_geo_org_unit/entities/cos_geo_org_unit.entity';
import { CosGeoOrgUnitService } from '../cos_geo_org_unit/cos_geo_org_unit.service';
import { OfficeService } from '../office/office.service';
import { Office } from '../office/entities/office.entity';
import { OfficerService } from '../officer/officer.service';
import { Officer } from '../officer/entities/officer.entity';
import { PersonService } from '../person/person.service';
import { Person } from '../person/entities/person.entity';

describe("AllegationComplaintService", () => {
  let service: AllegationComplaintService;
  let repo: Repository<AllegationComplaint>;
  let complaintService: ComplaintService;
  let complaintsRepository: Repository<Complaint>;
  let dataSourceMock: MockType<DataSource>

  const createQueryBuilder: any = {
    select: () => createQueryBuilder,
    addSelect: () => createQueryBuilder,
    groupBy: () => createQueryBuilder,
    where: () => createQueryBuilder
  };

  const oneComplaint = new Complaint(
    "test",
    "Chris",
    "1264 Disco Rd.",
    "test@test.ca",
    "(250)-555-3425",
    "(250)-555-3425",
    "(250)-555-3425",
    { "type": "Point", "coordinates": [ -48.23456, 20.12345 ] },
    "summary",
    "detail_text",
    new Date(),
    new Date(),
    "other text",
    "chris",
    new Date(),
    "chis",
    new Date(),
    "COS-1788",
    new AgencyCode("COS"),
    new AgencyCode("COS"),
    new ComplaintStatusCode("OPEN"),
    new GeoOrganizationUnitCode("CRBOCHLCTN")
);
  const oneAllegationComplaint = new AllegationComplaint(
    oneComplaint,
    new ViolationCode("AINVSPC"),
    true,
    true,
    "witness details",
    "Chris",
    new Date(),
    "Chris",
    new Date()
  );

  const twoComplaint = new Complaint(
    "test",
    "Chris",
    "1264 Disco Rd.",
    "test@test.ca",
    "(250)-555-3425",
    "(250)-555-3425",
    "(250)-555-3425",
    { "type": "Point", "coordinates": [ -48.23456, 20.12345 ] },
    "summary2",
    "detail_text2",
    new Date(),
    new Date(),
    "other text2",
    "chris",
    new Date(),
    "chis",
    new Date(),
    "COS-1789",
    new AgencyCode("COS"),
    new AgencyCode("COS"),
    new ComplaintStatusCode("OPEN"),
    new GeoOrganizationUnitCode("CRBOCHLCTN")
);
  const twoAllegationComplaint = new AllegationComplaint(
    twoComplaint,
    new ViolationCode("AINVSPC"),
    true,
    true,
    "witness details2",
    "Chris",
    new Date(),
    "Chris",
    new Date()
  );
  
  const threeDetailText = "test";
  const threeCallerName = "Chris";
  const threeCallerAddress = "1264 Disco Rd.";
  const threeCallerEmail = "test@test.ca";
  const threeCallerPhone1 = "(250)-555-3425";
  const threeCallerPhone2 = "(250)-555-3425";
  const threeCallerPhone3 = "(250)-555-3425"
  const threeLocationGeometryPoint =  JSON.parse(" { \"type\": \"Point\", \"coordinates\": [ -48.23456, 20.12345 ] }");
  const threeLocationSummaryText = "summary3";
  const threeLocationDetailText = "detail_text3";
  const threeIncidentDatetime = new Date();
  const threeIncidentReportedDatetime = new Date();
  const threeReferredByAgencyOtherText = "other text3";
  const threeCreateUserId = "chris";
  const threeCreateTimestamp = new Date();
  const threeUpdateUserId = "chis";
  const threeUpdateTimestamp = new Date();
  const threeCompliantIdentifier = "COS-1800";
  const threeReferredByAgencyCode = new AgencyCode("COS");
  const threeOwnedByAgencyCode = new AgencyCode("COS");
  const threeComplaintStatusCode = new ComplaintStatusCode("OPEN");
  const threeGeoOrganizationUnitCode = new GeoOrganizationUnitCode("CRBOCHLCTN");
  const threeComplaint = new Complaint(threeDetailText, threeCallerName, threeCallerAddress, threeCallerEmail, threeCallerPhone1, threeCallerPhone2, threeCallerPhone3, threeLocationGeometryPoint,
    threeLocationSummaryText, threeLocationDetailText, threeIncidentDatetime, threeIncidentReportedDatetime, threeReferredByAgencyOtherText, threeCreateUserId, threeCreateTimestamp, threeUpdateUserId,
    threeUpdateTimestamp, threeCompliantIdentifier, threeReferredByAgencyCode, threeOwnedByAgencyCode, threeComplaintStatusCode, threeGeoOrganizationUnitCode);
    const threeViolationCode = new ViolationCode("AINVSPC");
    const threeInProgressInd = true;
    const threeObservedInd = true;
    const threeSuspectWitnessDtlText = "witness 3";

  const threeAllegationComplaint = new AllegationComplaint(threeComplaint, threeViolationCode, threeInProgressInd, threeObservedInd, threeSuspectWitnessDtlText, threeCreateUserId, threeCreateTimestamp, threeUpdateUserId,
    threeUpdateTimestamp);

  const allegationComplaintArray = [oneAllegationComplaint, twoAllegationComplaint];

  const allegationComplaintRepositoryMockFactory = () => ({
    // mock repository functions for testing
    findAll: jest.fn(() => { return Promise.resolve(allegationComplaintArray)}),
    find: jest.fn(() => { return Promise.resolve(allegationComplaintArray)}),
    findOneOrFail: jest.fn(() => { return Promise.resolve(oneAllegationComplaint)}),
    findOne: jest.fn(() => { return Promise.resolve(oneAllegationComplaint)}),
    create: jest.fn(() => { return Promise.resolve(threeAllegationComplaint)}),
    save: jest.fn(),
    queryRunner:
      {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn()
        }
      },

      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnValue(`allegation_complaint_guid = :id, ${oneAllegationComplaint.allegation_complaint_guid}`),
        getOne: jest.fn().mockResolvedValue(oneAllegationComplaint),
        getMany: jest.fn().mockResolvedValue(allegationComplaintArray),
      })),

    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    //update: jest.fn().mockResolvedValue(true),
    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    delete: jest.fn(() => { return Promise.resolve(true)}),
  })

  const complaintRepositoryMockFactory = () => ({
    // mock repository functions for testing
    findAll: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    queryRunner:
      {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn()
        }
      },

    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    //update: jest.fn().mockResolvedValue(true),
    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    delete: jest.fn(() => { return Promise.resolve(true)}),
  });

  const cosGeoOrgUnitRepositoryMockFactory = () => ({
    // mock repository functions for testing
    findAll: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    queryRunner:
      {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn()
        }
      },

    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    //update: jest.fn().mockResolvedValue(true),
    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    delete: jest.fn(() => { return Promise.resolve(true)}),
  });

  const officeRepositoryMockFactory = () => ({
    // mock repository functions for testing
    findAll: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    queryRunner:
      {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn()
        }
      },

    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    //update: jest.fn().mockResolvedValue(true),
    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    delete: jest.fn(() => { return Promise.resolve(true)}),
  });

  const officerRepositoryMockFactory = () => ({
    // mock repository functions for testing
    findAll: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    queryRunner:
      {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn()
        }
      },

    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    //update: jest.fn().mockResolvedValue(true),
    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    delete: jest.fn(() => { return Promise.resolve(true)}),
  });

  const personRepositoryMockFactory = () => ({
    // mock repository functions for testing
    findAll: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    queryRunner:
      {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn()
        }
      },

    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    //update: jest.fn().mockResolvedValue(true),
    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    delete: jest.fn(() => { return Promise.resolve(true)}),
  });


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllegationComplaintService,
        ComplaintService,
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory
        },
        {
          provide: getRepositoryToken(AllegationComplaint),
          useFactory: allegationComplaintRepositoryMockFactory
        },
        {
          provide: getRepositoryToken(Complaint),
          useFactory: complaintRepositoryMockFactory
        },
        CosGeoOrgUnitService,
        {
          provide: getRepositoryToken(CosGeoOrgUnit),
          useFactory: cosGeoOrgUnitRepositoryMockFactory,
        },        
        OfficeService,
        {
          provide: getRepositoryToken(Office),
          useFactory: officeRepositoryMockFactory,
        },       
        OfficerService,
        {
          provide: getRepositoryToken(Officer),
          useFactory: officerRepositoryMockFactory,
        },
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useFactory: personRepositoryMockFactory,
        },
      ],
      
    }).compile().catch((err) => {
      // Helps catch ninja like errors from compilation
      console.error(err);
      throw err;
    });

    service = module.get<AllegationComplaintService>(AllegationComplaintService);
    repo = module.get<Repository<AllegationComplaint>>(getRepositoryToken(AllegationComplaint));
    complaintService = module.get<ComplaintService>(ComplaintService);
    complaintsRepository = module.get<Repository<Complaint>>(getRepositoryToken(Complaint));
    dataSourceMock = module.get(DataSource);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should successfully add a complaint", async() => {
    await service.create(threeAllegationComplaint);
    expect(dataSourceMock.createQueryRunner).toBeCalled();
  });

  it("should return an array of complaints", async () => {
    const complaints = await service.findAll('incident_reported_datetime', 'DESC');
    expect(complaints).toEqual(allegationComplaintArray);
  });

  describe("remove", () => {
    it("should return {deleted: true}", () => {
      expect(service.remove(twoAllegationComplaint.allegation_complaint_guid)).resolves.toEqual({ deleted: true });
    });
    it("should return {deleted: false, message: err.message}", () => {
      jest
        .spyOn(repo, "delete")
        .mockRejectedValueOnce(new Error("Bad Delete Method."));
      expect(service.remove("903f87c8-76dd-427c-a1bb-111111111111")).resolves.toEqual({
        deleted: false,
        message: "Bad Delete Method.",
      });
    });
  });
});
