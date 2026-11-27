import { Test, TestingModule } from "@nestjs/testing";
import { ComplaintAttachmentReferenceController } from "./complaint_attachment_reference.controller";
import { ComplaintAttachmentReferenceService } from "./complaint_attachment_reference.service";

describe("ComplaintAttachmentReferenceController", () => {
  let controller: ComplaintAttachmentReferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplaintAttachmentReferenceController],
      providers: [
        {
          provide: ComplaintAttachmentReferenceService,
          useValue: {},
        },
      ],
    }).compile();

    controller = await module.resolve<ComplaintAttachmentReferenceController>(ComplaintAttachmentReferenceController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
