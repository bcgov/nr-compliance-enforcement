import { Test, TestingModule } from '@nestjs/testing';
import { PersonComplaintXrefService } from './person_complaint_xref.service';

describe('PersonComplaintXrefService', () => {
  let service: PersonComplaintXrefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonComplaintXrefService],
    }).compile();

    service = module.get<PersonComplaintXrefService>(PersonComplaintXrefService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
