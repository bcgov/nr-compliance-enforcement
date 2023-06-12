import { Test, TestingModule } from '@nestjs/testing';
import { PersonComplaintXrefCodeController } from './person_complaint_xref_code.controller';
import { PersonComplaintXrefCodeService } from './person_complaint_xref_code.service';

describe('PersonComplaintXrefCodeController', () => {
  let controller: PersonComplaintXrefCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonComplaintXrefCodeController],
      providers: [PersonComplaintXrefCodeService],
    }).compile();

    controller = module.get<PersonComplaintXrefCodeController>(PersonComplaintXrefCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
