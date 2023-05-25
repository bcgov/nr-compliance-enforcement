import { Test, TestingModule } from '@nestjs/testing';
import { HwcrComplaintController } from './hwcr_complaint.controller';
import { HwcrComplaintService } from './hwcr_complaint.service';
import { ComplaintService } from '../complaint/complaint.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Complaint } from '../complaint/entities/complaint.entity';
import { HwcrComplaint } from './entities/hwcr_complaint.entity';
import { AttractantHwcrXref } from '../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity';
import { AttractantHwcrXrefService } from '../attractant_hwcr_xref/attractant_hwcr_xref.service';
import { DataSource } from 'typeorm';
import { dataSourceMockFactory } from '../../__mocks/datasource';

describe('HwcrComplaintController', () => {
  let controller: HwcrComplaintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HwcrComplaintController],
      providers: [
        HwcrComplaintService,
        {
          provide: getRepositoryToken(HwcrComplaint),
          useValue: {},
        },
        ComplaintService,
        {
          provide: getRepositoryToken(Complaint),
          useValue: {},
        },
        AttractantHwcrXrefService,
        {
          provide: getRepositoryToken(AttractantHwcrXref),
          useValue: {},
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory
        }
      ],
    }).compile();

    controller = module.get<HwcrComplaintController>(HwcrComplaintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
