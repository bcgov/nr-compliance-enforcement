import { Test, TestingModule } from "@nestjs/testing";
import { EmailReferenceService } from "./email_reference.service";

describe("EmailReferenceService", () => {
  let service: EmailReferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailReferenceService],
    }).compile();

    service = module.get<EmailReferenceService>(EmailReferenceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
