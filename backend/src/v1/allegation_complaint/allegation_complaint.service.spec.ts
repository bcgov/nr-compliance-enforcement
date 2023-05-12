import { Test, TestingModule } from '@nestjs/testing';
import { AllegationComplaintService } from './allegation_complaint.service';
import { Repository } from 'typeorm';
import { AllegationComplaint } from './entities/allegation_complaint.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Complaint } from '../complaint/entities/complaint.entity';
import { AgencyCode } from '../agency_code/entities/agency_code.entity';
import { ComplaintStatusCode } from '../complaint_status_code/entities/complaint_status_code.entity';
import { GeoOrganizationUnitCode } from '../geo_organization_unit_code/entities/geo_organization_unit_code.entity';
import { ViolationCode } from '../violation_code/entities/violation_code.entity';
import { ComplaintService } from '../complaint/complaint.service';

describe("AllegationComplaintService", () => {
  let service: AllegationComplaintService;
  let repo: Repository<AllegationComplaint>;

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
    "other text",
    "chris",
    "903f87c8-76dd-427c-a1bb-4d179e443252",
    new Date(),
    "chis",
    "903f87c8-76dd-427c-a1bb-4d179e443252",
    new Date(),
    "COS-1788",
    new AgencyCode(),
    new AgencyCode(),
    new ComplaintStatusCode(),
    new GeoOrganizationUnitCode()
);
  const oneAllegationComplaint = new AllegationComplaint(
    oneComplaint,
    new ViolationCode(),
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
    "other text2",
    "chris",
    "903f87c8-76dd-427c-a1bb-4d179e443252",
    new Date(),
    "chis",
    "903f87c8-76dd-427c-a1bb-4d179e443252",
    new Date(),
    "COS-1789",
    new AgencyCode(),
    new AgencyCode(),
    new ComplaintStatusCode(),
    new GeoOrganizationUnitCode()
);
  const twoAllegationComplaint = new AllegationComplaint(
    twoComplaint,
    new ViolationCode(),
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
  const threeIncidentReportedDatetime = new Date();
  const threeReferredByAgencyOtherText = "other text3";
  const threeCreateUserId = "chris";
  const threeCreateUserGuid = "903f87c8-76dd-427c-a1bb-4d179e443252";
  const threeCreateTimestamp = new Date();
  const threeUpdateUserId = "chis";
  const threeUpdateUserGuid = "903f87c8-76dd-427c-a1bb-4d179e443252";
  const threeUpdateTimestamp = new Date();
  const threeCompliantIdentifier = "COS-1800";
  const threeReferredByAgencyCode = new AgencyCode();
  const threeOwnedByAgencyCode = new AgencyCode();
  const threeComplaintStatusCode = new ComplaintStatusCode();
  const threeGeoOrganizationUnitCode = new GeoOrganizationUnitCode();

  const threeComplaint = new Complaint(threeDetailText, threeCallerName, threeCallerAddress, threeCallerEmail, threeCallerPhone1, threeCallerPhone2, threeCallerPhone3, threeLocationGeometryPoint,
    threeLocationSummaryText, threeLocationDetailText, threeIncidentReportedDatetime, threeReferredByAgencyOtherText, threeCreateUserId, threeCreateUserGuid, threeCreateTimestamp, threeUpdateUserId,
    threeUpdateUserGuid, threeUpdateTimestamp, threeCompliantIdentifier, threeReferredByAgencyCode, threeOwnedByAgencyCode, threeComplaintStatusCode, threeGeoOrganizationUnitCode);
    const threeViolationCode = new ViolationCode();
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllegationComplaintService,
        {
          provide: getRepositoryToken(AllegationComplaint),
          useValue: {
            // mock repository functions for testing
            find: jest.fn().mockResolvedValue(allegationComplaintArray),
            findOneOrFail: jest.fn().mockResolvedValue(oneAllegationComplaint),
            create: jest.fn().mockReturnValue(threeAllegationComplaint),
            save: jest.fn(),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            //update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            delete: jest.fn().mockResolvedValue(true),
          },
        },
        ComplaintService,
        {
          provide: getRepositoryToken(Complaint),
          useValue: {},
        },
        
      ],
      
    }).compile();

    service = module.get<AllegationComplaintService>(AllegationComplaintService);
    repo = module.get<Repository<AllegationComplaint>>(getRepositoryToken(AllegationComplaint));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createOne", () => {
    it("should successfully add a user", () => {
      expect(service.create(newAllegationComplaint)).resolves.toEqual(threeAllegationComplaint);
      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith(newAllegationComplaint);
      expect(repo.save).toBeCalledTimes(1);
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users = await service.findAll();
      expect(users).toEqual(allegationComplaintArray);
    });
  });

  describe("findOne", () => {
    it("should get a single user", () => {
      const repoSpy = jest.spyOn(repo, "findOneOrFail");
      expect(service.findOne(oneAllegationComplaint.allegation_complaint_guid)).resolves.toEqual(oneAllegationComplaint);
      expect(repoSpy).toBeCalledWith(oneAllegationComplaint.allegation_complaint_guid);
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
      expect(repoSpy).toBeCalledWith(-1);
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
});
