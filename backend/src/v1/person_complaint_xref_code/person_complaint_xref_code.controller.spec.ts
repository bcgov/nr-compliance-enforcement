import { Test, TestingModule } from '@nestjs/testing';
import { PersonComplaintXrefCodeController } from './person_complaint_xref_code.controller';
import { PersonComplaintXrefCodeService } from './person_complaint_xref_code.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PersonComplaintXrefCode } from './entities/person_complaint_xref_code.entity';
import { DataSource } from 'typeorm';
import { dataSourceMockFactory } from '../../../test/mocks/datasource';

describe('PersonComplaintXrefCodeController', () => {
  let controller: PersonComplaintXrefCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonComplaintXrefCodeController],
      providers: [
        PersonComplaintXrefCodeService,
        {
          provide: getRepositoryToken(PersonComplaintXrefCode),
          useValue: {

          }
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory
        }
      ],
    }).compile();

    controller = module.get<PersonComplaintXrefCodeController>(PersonComplaintXrefCodeController);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
