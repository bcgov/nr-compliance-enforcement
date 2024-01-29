import { Injectable, Logger } from '@nestjs/common';
import { CreateStagingComplaintDto } from './dto/create-staging_complaint.dto';
import { UpdateStagingComplaintDto } from './dto/update-staging_complaint.dto';
import { StagingComplaint } from './entities/staging_complaint.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StagingComplaintService {

  private readonly logger = new Logger(StagingComplaintService.name);

  constructor(
    @InjectRepository(StagingComplaint)
    private stagingComplaintRepository: Repository<StagingComplaint>
  ) {}

  async create(stagingComplaint: CreateStagingComplaintDto): Promise<StagingComplaint> {
    const newStagingComplaint = this.stagingComplaintRepository.create(stagingComplaint);
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
