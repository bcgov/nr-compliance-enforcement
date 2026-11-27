import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { REQUEST } from "@nestjs/core";
import { HttpStatus, NotFoundException } from "@nestjs/common";
import { ComplaintAttachmentReferenceService } from "./complaint_attachment_reference.service";
import { ComplaintAttachmentReference } from "./entities/complaint_attachment_reference.entity";
import { ChefsService } from "../../external_api/chefs/chefs.service";

describe("ComplaintAttachmentReferenceService", () => {
  let service: ComplaintAttachmentReferenceService;

  const mockRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockChefsService = {
    getFile: jest.fn(),
  };

  const mockRequest = {
    user: { idir_username: "TEST" },
  };

  const reference = {
    complaint_attachment_reference_guid: "6b6d6a9e-3c3e-4e1a-9a55-1f0d1f0c2a01",
    complaint_identifier: "26-800001",
    chefs_file_guid_ref: "0f3c0d8e-2a7b-4d6e-8f1a-5b9c3e2d1a00",
    filename_text: "photo.jpg",
    file_size: 1024,
    active_ind: true,
    create_user_id: "webeoc",
    create_utc_timestamp: new Date(),
    update_user_id: null,
    update_utc_timestamp: null,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplaintAttachmentReferenceService,
        {
          provide: getRepositoryToken(ComplaintAttachmentReference),
          useValue: mockRepository,
        },
        {
          provide: ChefsService,
          useValue: mockChefsService,
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    service = await module.resolve<ComplaintAttachmentReferenceService>(ComplaintAttachmentReferenceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should fetch the file using the CHEFS file id from the reference", async () => {
    const file = { data: Buffer.from("file"), headers: { "content-type": "image/jpeg" } };
    mockRepository.findOneBy.mockResolvedValue({ ...reference });
    mockChefsService.getFile.mockResolvedValue(file);

    expect(await service.getFile(reference.complaint_attachment_reference_guid as any)).toBe(file);
    expect(mockChefsService.getFile).toHaveBeenCalledWith(reference.chefs_file_guid_ref);
  });

  it("should throw a 502 when CHEFS fails", async () => {
    mockRepository.findOneBy.mockResolvedValue({ ...reference });
    mockChefsService.getFile.mockRejectedValue({ response: { status: 404 } });

    await expect(service.getFile(reference.complaint_attachment_reference_guid as any)).rejects.toMatchObject({
      status: HttpStatus.BAD_GATEWAY,
    });
  });

  it("should throw not found when there is no active reference", async () => {
    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(service.getFile(reference.complaint_attachment_reference_guid as any)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockChefsService.getFile).not.toHaveBeenCalled();
  });

  it("should set the reference inactive with the user id and timestamp", async () => {
    mockRepository.findOneBy.mockResolvedValue({ ...reference });
    mockRepository.save.mockImplementation(async (entity) => entity);

    const result = await service.remove(reference.complaint_attachment_reference_guid as any);

    expect(result.active_ind).toBe(false);
    expect(result.update_user_id).toBe("TEST");
    expect(result.update_utc_timestamp).toBeInstanceOf(Date);
  });
});
