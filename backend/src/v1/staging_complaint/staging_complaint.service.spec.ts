import { Test, TestingModule } from "@nestjs/testing";
import { StagingComplaintService } from "./staging_complaint.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { StagingComplaint } from "./entities/staging_complaint.entity";
import { Complaint } from "../complaint/entities/complaint.entity";
import { ComplaintUpdate } from "../complaint_updates/entities/complaint_updates.entity";
import { EmailService } from "../email/email.service";

// Minimal chainable query builder that resolves getOne() with the given result.
const queryBuilderReturning = (result: any) => {
  const builder: any = {};
  for (const method of ["leftJoin", "leftJoinAndSelect", "select", "where", "andWhere", "orderBy"]) {
    builder[method] = jest.fn().mockReturnValue(builder);
  }
  builder.getOne = jest.fn().mockResolvedValue(result);
  return builder;
};

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

describe("StagingComplaintService", () => {
  let service: StagingComplaintService;
  let stagingRepository: any;
  let complaintRepository: any;
  let emailService: { sendNewComplaintNotification: jest.Mock };

  const chefsSubmission = {
    incident_number: "26-800000",
    report_type: "ERS",
    chefs_confirmation_id: "EA379825",
  };

  const createdComplaint = {
    complaint_identifier: "26-800000",
    owned_by_agency_code_ref: "COS",
    geo_organization_unit_code: "100MHHS",
    park_guid: "1a736bc3-2cfa-43db-b077-217aa89477d1",
  };

  beforeEach(async () => {
    stagingRepository = {
      createQueryBuilder: jest.fn(),
      manager: { query: jest.fn().mockResolvedValue([]) },
    };
    complaintRepository = { createQueryBuilder: jest.fn() };
    emailService = { sendNewComplaintNotification: jest.fn().mockResolvedValue(["someone@gov.bc.ca"]) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StagingComplaintService,
        {
          provide: getRepositoryToken(StagingComplaint),
          useValue: stagingRepository,
        },
        {
          provide: getRepositoryToken(Complaint),
          useValue: complaintRepository,
        },
        {
          provide: getRepositoryToken(ComplaintUpdate),
          useValue: {},
        },
        {
          provide: EmailService,
          useValue: emailService,
        },
      ],
    }).compile();

    service = await module.resolve<StagingComplaintService>(StagingComplaintService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("processWebEOCComplaint", () => {
    it("sends a new complaint notification once a pending CHEFS complaint is created", async () => {
      stagingRepository.createQueryBuilder.mockReturnValue(queryBuilderReturning({ complaintJsonb: chefsSubmission }));
      complaintRepository.createQueryBuilder.mockReturnValue(queryBuilderReturning(createdComplaint));

      await service.processWebEOCComplaint("26-800000");
      await flushPromises();

      expect(stagingRepository.manager.query).toHaveBeenCalledWith(
        'SELECT "complaint".insert_complaint_from_staging($1)',
        ["26-800000"],
      );
      expect(emailService.sendNewComplaintNotification).toHaveBeenCalledWith({
        complaintId: "26-800000",
        complaintType: "ERS",
        agencyCode: "COS",
        communityCode: "100MHHS",
        parkGuid: "1a736bc3-2cfa-43db-b077-217aa89477d1",
        submission: chefsSubmission,
      });
    });

    it("does not notify for WebEOC complaints", async () => {
      stagingRepository.createQueryBuilder.mockReturnValue(
        queryBuilderReturning({ complaintJsonb: { incident_number: "26-000123", report_type: "ERS" } }),
      );

      await service.processWebEOCComplaint("26-000123");
      await flushPromises();

      expect(emailService.sendNewComplaintNotification).not.toHaveBeenCalled();
    });

    it("does not notify when there is no pending insert (already processed)", async () => {
      stagingRepository.createQueryBuilder.mockReturnValue(queryBuilderReturning(null));

      await service.processWebEOCComplaint("26-800000");
      await flushPromises();

      expect(emailService.sendNewComplaintNotification).not.toHaveBeenCalled();
    });

    it("does not notify when the complaint failed to be created", async () => {
      stagingRepository.createQueryBuilder.mockReturnValue(queryBuilderReturning({ complaintJsonb: chefsSubmission }));
      complaintRepository.createQueryBuilder.mockReturnValue(queryBuilderReturning(null));

      await service.processWebEOCComplaint("26-800000");
      await flushPromises();

      expect(emailService.sendNewComplaintNotification).not.toHaveBeenCalled();
    });

    it("still succeeds when sending the notification fails", async () => {
      stagingRepository.createQueryBuilder.mockReturnValue(queryBuilderReturning({ complaintJsonb: chefsSubmission }));
      complaintRepository.createQueryBuilder.mockReturnValue(queryBuilderReturning(createdComplaint));
      emailService.sendNewComplaintNotification.mockRejectedValue(new Error("CHES is down"));

      await expect(service.processWebEOCComplaint("26-800000")).resolves.toBeUndefined();
      await flushPromises();

      expect(emailService.sendNewComplaintNotification).toHaveBeenCalled();
    });
  });
});
