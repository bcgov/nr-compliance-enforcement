import { Test, TestingModule } from "@nestjs/testing";
import { EmailReferenceService } from "./email_reference.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EmailReference } from "./entities/email_reference.entity";

describe("EmailReferenceService", () => {
  let service: EmailReferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailReferenceService,
        {
          provide: getRepositoryToken(EmailReference),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EmailReferenceService>(EmailReferenceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
