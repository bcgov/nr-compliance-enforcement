import { Injectable } from '@nestjs/common';
import { CreateComplaintTypeCodeDto } from './dto/create-complaint_type_code.dto';
import { UpdateComplaintTypeCodeDto } from './dto/update-complaint_type_code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ComplaintTypeCode } from './entities/complaint_type_code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ComplaintTypeCodeService {
  constructor(
    @InjectRepository(ComplaintTypeCode)
    private complaintTypeCodeRepository: Repository<ComplaintTypeCode>
  ) {}

  async create(complaintTypeCode: CreateComplaintTypeCodeDto): Promise<ComplaintTypeCode> {
    const newComplaintTypeCode = this.complaintTypeCodeRepository.create(complaintTypeCode);
    await this.complaintTypeCodeRepository.save(newComplaintTypeCode);
    return newComplaintTypeCode;
  }

  async findAll(): Promise<ComplaintTypeCode[]> {
    console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
    return this.complaintTypeCodeRepository.find(
      {
        order: 
        {
          display_order: "ASC"
        }
      }
    );
  }

  async findOne(id: any): Promise<ComplaintTypeCode> {
    return this.complaintTypeCodeRepository.findOneOrFail(id);
  }

  async update(complaint_type_code: string, updateComplaintTypeCodeDto: UpdateComplaintTypeCodeDto): Promise<ComplaintTypeCode> {
    await this.complaintTypeCodeRepository.update({ complaint_type_code }, updateComplaintTypeCodeDto);
    return this.findOne(complaint_type_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.complaintTypeCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
