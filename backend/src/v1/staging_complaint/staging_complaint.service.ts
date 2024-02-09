import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StagingStatusCodeEnum } from '../../enum/staging_status_code.enum';
import { StagingStatusCode } from '../staging_status_code/entities/staging_status_code.entity';
import { StagingActivityCodeEnum } from '../../enum/staging_activity_code.enum';
import { StagingActivityCode } from '../staging_activity_code/entities/staging_activity_code.entity';
import { WebEOCComplaint } from '../../types/webeoc-complaint';
import { StagingComplaint } from './entities/staging_complaint.entity';

@Injectable()
export class StagingComplaintService {

  private readonly logger = new Logger(StagingComplaintService.name);

  constructor(
    @InjectRepository(StagingComplaint)
    private stagingComplaintRepository: Repository<StagingComplaint>
  ) {}

  
  async create(stagingComplaint: WebEOCComplaint): Promise<StagingComplaint> {

    const existingStagingComplaint = await this.stagingComplaintRepository
    .createQueryBuilder('stagingComplaint')
    .leftJoinAndSelect('stagingComplaint.stagingActivityCode', 'stagingActivityCode')
    .where('stagingComplaint.complaintIdentifer = :complaintIdentifier', { complaintIdentifier: stagingComplaint.incident_number })
    .andWhere('stagingActivityCode.stagingActivityCode = :activityCode', { activityCode: 'INSERT' })
    .getOne();

    // ignore duplicates
    if (existingStagingComplaint) {
      return;
    }
    
    const newStagingComplaint = this.stagingComplaintRepository.create();
    newStagingComplaint.stagingStatusCode = { stagingStatusCode: StagingStatusCodeEnum.PENDING } as StagingStatusCode;
    newStagingComplaint.stagingActivityCode = { stagingActivityCode: StagingActivityCodeEnum.INSERT } as StagingActivityCode;
    newStagingComplaint.complaintIdentifer = stagingComplaint.incident_number;
    newStagingComplaint.complaintJsonb = stagingComplaint;
    newStagingComplaint.createUserId = 'WebEOC';
    newStagingComplaint.createUtcTimestamp = new Date;
    newStagingComplaint.updateUserId = 'WebEOC';
    newStagingComplaint.updateUtcTimestamp = new Date;
    
    await this.stagingComplaintRepository.save(newStagingComplaint);
    return newStagingComplaint;
  }

  async process(complaintIdentifier: string): Promise<any> {
    await this.stagingComplaintRepository.manager.query(
      'SELECT public.insert_complaint_from_staging($1)', 
      [complaintIdentifier]
    );
  }
}
