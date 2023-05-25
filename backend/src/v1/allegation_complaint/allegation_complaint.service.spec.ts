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

describe("AllegationComplaintService", () => {
  let service: AllegationComplaintService;
  let repo: Repository<AllegationComplaint>;
  let complaintService: ComplaintService;
  let complaintsRepository: Repository<Complaint>;
  let dataSourceMock: MockType<DataSource>

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
    "903f87c8-76dd-427c-a1bb-4d179e443252",
    new Date(),
    "chis",
    "903f87c8-76dd-427c-a1bb-4d179e443252",
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
    "903f87c8-76dd-427c-a1bb-4d179e443252",
    new Date(),
    "Chris",
    "903f87c8-76dd-427c-a1bb-4d179e443252",
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
    "903f87c8-76dd-427c-a1bb-4d179e443252",
    new Date(),
    "chis",
    "903f87c8-76dd-427c-a1bb-4d179e443252",
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
    "903f87c8-76dd-427c-a1bb-4d179e443252",
    new Date(),
    "Chris",
    "903f87c8-76dd-427c-a1bb-4d179e443252",
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
  const threeCreateUserGuid = "903f87c8-76dd-427c-a1bb-4d179e443252";
  const threeCreateTimestamp = new Date();
  const threeUpdateUserId = "chis";
  const threeUpdateUserGuid = "903f87c8-76dd-427c-a1bb-4d179e443252";
  const threeUpdateTimestamp = new Date();
  const threeCompliantIdentifier = "COS-1800";
  const threeReferredByAgencyCode = new AgencyCode("COS");
  const threeOwnedByAgencyCode = new AgencyCode("COS");
  const threeComplaintStatusCode = new ComplaintStatusCode("OPEN");
  const threeGeoOrganizationUnitCode = new GeoOrganizationUnitCode("CRBOCHLCTN");
  const threeComplaint = new Complaint(threeDetailText, threeCallerName, threeCallerAddress, threeCallerEmail, threeCallerPhone1, threeCallerPhone2, threeCallerPhone3, threeLocationGeometryPoint,
    threeLocationSummaryText, threeLocationDetailText, threeIncidentDatetime, threeIncidentReportedDatetime, threeReferredByAgencyOtherText, threeCreateUserId, threeCreateUserGuid, threeCreateTimestamp, threeUpdateUserId,
    threeUpdateUserGuid, threeUpdateTimestamp, threeCompliantIdentifier, threeReferredByAgencyCode, threeOwnedByAgencyCode, threeComplaintStatusCode, threeGeoOrganizationUnitCode);
    const threeViolationCode = new ViolationCode("AINVSPC");
    const threeInProgressInd = true;
    const threeObservedInd = true;
    const threeSuspectWitnessDtlText = "witness 3";

  const threeAllegationComplaint = new AllegationComplaint(threeComplaint, threeViolationCode, threeInProgressInd, threeObservedInd, threeSuspectWitnessDtlText, threeCreateUserId, threeCreateUserGuid, threeCreateTimestamp, threeUpdateUserId,
    threeUpdateUserGuid, threeUpdateTimestamp);

  const newAllegationComplaint = {
    detail_text: threeDetailText,
    caller_name: threeCallerName,
    caller_address: threeCallerAddress,
    caller_email: threeCallerEmail,
    caller_phone_1: threeCallerPhone1,
    caller_phone_2: threeCallerPhone2,
    caller_phone_3: threeCallerPhone3,
    location_geometry_point: threeLocationGeometryPoint,
    location_summary_text: threeLocationSummaryText,
    location_detailed_text: threeLocationDetailText,
    incident_datetime: threeIncidentDatetime,
    incident_reported_datetime: threeIncidentReportedDatetime,
    referred_by_agency_other_text: threeReferredByAgencyOtherText,
    create_user_id: threeCreateUserId,
    create_user_guid: threeCreateUserGuid,
    create_timestamp: threeCreateTimestamp,
    update_user_id: threeUpdateUserId,
    update_user_guid: threeUpdateUserGuid,
    update_timestamp: threeUpdateTimestamp,
    complaint_identifier: threeCompliantIdentifier,
    referred_by_agency_code: threeReferredByAgencyCode,
    owned_by_agency_code: threeOwnedByAgencyCode,
    complaint_status_code: threeComplaintStatusCode,
    geo_organization_unit_code: threeGeoOrganizationUnitCode,
    violation_code: threeViolationCode,
    in_progress_ind: threeInProgressInd,
    observed_ind: threeObservedInd,
    suspect_witness_dtl_text: threeSuspectWitnessDtlText,
  };

  const allegationComplaintArray = [oneAllegationComplaint, twoAllegationComplaint];

  const allegationComplaintRepositoryMockFactory = () => ({
    // mock repository functions for testing
    find: jest.fn(() => { return Promise.resolve(allegationComplaintArray)}),
    findOneOrFail: jest.fn(() => { return Promise.resolve(oneAllegationComplaint)}),
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

    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    //update: jest.fn().mockResolvedValue(true),
    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    delete: jest.fn(() => { return Promise.resolve(true)}),
  })

  const complaintRepositoryMockFactory = () => ({
    // mock repository functions for testing
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
  })

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
        }
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
    //jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
    await dataSourceMock.createQueryBuilder;
    const applications = await service.create(threeAllegationComplaint);
    expect(dataSourceMock.createQueryRunner).toBeCalled();
  });

    it("should return an array of users", async () => {
      const users = await service.findAll();
      expect(users).toEqual(allegationComplaintArray);
    });
 
  describe("findOne", () => {
    it("should get a single user", () => {
      const repoSpy = jest.spyOn(repo, "findOneOrFail");
      expect(service.findOne(oneAllegationComplaint.allegation_complaint_guid)).resolves.toEqual(oneAllegationComplaint);
      //expect(repoSpy).toBeCalledWith(oneAllegationComplaint.allegation_complaint_guid);
    });
  });

  /* TODO when implementing update
  describe("update", () => {
  });
  */

  describe("remove", () => {
    it("should return {deleted: true}", () => {
      expect(service.remove(twoAllegationComplaint.allegation_complaint_guid)).resolves.toEqual({ deleted: true });
    });
    it("should return {deleted: false, message: err.message}", () => {
      const repoSpy = jest
        .spyOn(repo, "delete")
        .mockRejectedValueOnce(new Error("Bad Delete Method."));
      expect(service.remove("903f87c8-76dd-427c-a1bb-111111111111")).resolves.toEqual({
        deleted: false,
        message: "Bad Delete Method.",
      });
      //expect(repoSpy).toBeCalledWith(-1);
      //expect(repoSpy).toBeCalledTimes(1);
    });
  });
});
