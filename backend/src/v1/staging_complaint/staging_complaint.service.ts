import { Injectable, Logger } from '@nestjs/common';
import { UpdateStagingComplaintDto } from './dto/update-staging_complaint.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StagingStatusCodeEnum } from 'src/enum/staging_status_code.enum';
import { StagingStatusCode } from '../staging_status_code/entities/staging_status_code.entity';
import { StagingActivityCodeEnum } from 'src/enum/staging_activity_code.enum';
import { StagingActivityCode } from '../staging_activity_code/entities/staging_activity_code.entity';
import { WebEOCComplaint } from 'src/types/webeoc-complaint';
import { StagingComplaint } from './entities/staging_complaint.entity';

@Injectable()
export class StagingComplaintService {

  private readonly logger = new Logger(StagingComplaintService.name);

  constructor(
    @InjectRepository(StagingComplaint)
    private stagingComplaintRepository: Repository<StagingComplaint>
  ) {}

  async create(stagingComplaint: WebEOCComplaint): Promise<StagingComplaint> {
    
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
  findAll() {
    return `This action returns all stagingComplaint`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stagingComplaint`;
  }

  update(id: number, updateStagingComplaintDto: UpdateStagingComplaintDto) {
    return `This action updates a #${id} stagingComplaint`;
  }

  remove(id: number) {
    return `This action removes a #${id} stagingComplaint`;
  }
}
