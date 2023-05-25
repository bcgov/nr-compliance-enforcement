import { Test, TestingModule } from '@nestjs/testing';
import { HwcrComplaintService } from './hwcr_complaint.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HwcrComplaint } from './entities/hwcr_complaint.entity';
import { ComplaintService } from '../complaint/complaint.service';
import { Complaint } from '../complaint/entities/complaint.entity';
import { AttractantHwcrXrefService } from '../attractant_hwcr_xref/attractant_hwcr_xref.service';
import { AttractantHwcrXref } from '../attractant_hwcr_xref/entities/attractant_hwcr_xref.entity';
import { DataSource } from 'typeorm';
import { dataSourceMockFactory } from '../../mocks/datasource';

describe('HwcrComplaintService', () => {
  let service: HwcrComplaintService;
  let complaintService: ComplaintService;
  let attractantHwcrXrefService: AttractantHwcrXrefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HwcrComplaintService,
        {
          provide: getRepositoryToken(HwcrComplaint),
          useValue: {

          },
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
        }],
    }).compile().catch((err) => {
      // Helps catch ninja like errors from compilation
      console.error(err);
      throw err;
    });;

    service = module.get<HwcrComplaintService>(HwcrComplaintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
