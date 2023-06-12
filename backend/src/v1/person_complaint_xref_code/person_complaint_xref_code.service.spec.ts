import { Test, TestingModule } from '@nestjs/testing';
import { PersonComplaintXrefCodeService } from './person_complaint_xref_code.service';

describe('PersonComplaintXrefCodeService', () => {
  let service: PersonComplaintXrefCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonComplaintXrefCodeService],
    }).compile();

    service = module.get<PersonComplaintXrefCodeService>(PersonComplaintXrefCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
