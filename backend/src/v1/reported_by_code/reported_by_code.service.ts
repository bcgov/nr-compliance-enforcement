import { Injectable } from '@nestjs/common';
import { CreateReportedByCodeDto } from './dto/create-reported_by_code.dto';
import { UpdateReportedByCodeDto } from './dto/update-reported_by_code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportedByCode } from './entities/reported_by_code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportedByCodeService {
  constructor(
    @InjectRepository(ReportedByCode)
    private reportedByCodeRepository: Repository<ReportedByCode>
  ) {}

  async create(agencyCode: CreateReportedByCodeDto): Promise<ReportedByCode> {
    const newAgencyCode = this.reportedByCodeRepository.create(agencyCode);
    await this.reportedByCodeRepository.save(newAgencyCode);
    return newAgencyCode;
  }

  async findAll(): Promise<ReportedByCode[]> {
    return this.reportedByCodeRepository.find();
  }

  async findOne(id: any): Promise<ReportedByCode> {
    return this.reportedByCodeRepository.findOneOrFail(id);
  }

  async update(reported_by_code: string, updateAgencyCodeDto: UpdateReportedByCodeDto): Promise<ReportedByCode> {
    await this.reportedByCodeRepository.update({ reported_by_code }, updateAgencyCodeDto);
    return this.findOne(reported_by_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.reportedByCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
