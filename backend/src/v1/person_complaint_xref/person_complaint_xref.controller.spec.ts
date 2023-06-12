import { Test, TestingModule } from '@nestjs/testing';
import { PersonComplaintXrefController } from './person_complaint_xref.controller';
import { PersonComplaintXrefService } from './person_complaint_xref.service';

describe('PersonComplaintXrefController', () => {
  let controller: PersonComplaintXrefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonComplaintXrefController],
      providers: [PersonComplaintXrefService],
    }).compile();

    controller = module.get<PersonComplaintXrefController>(PersonComplaintXrefController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
