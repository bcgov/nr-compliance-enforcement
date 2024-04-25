import { Injectable } from "@nestjs/common";
import { CreateComplaintStatusCodeDto } from "./dto/create-complaint_status_code.dto";
import { UpdateComplaintStatusCodeDto } from "./dto/update-complaint_status_code.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ComplaintStatusCode } from "./entities/complaint_status_code.entity";
import { Repository } from "typeorm";

@Injectable()
export class ComplaintStatusCodeService {
  constructor(
    @InjectRepository(ComplaintStatusCode)
    private complaintStatusCodeRepository: Repository<ComplaintStatusCode>,
  ) {}

  async create(complaintStatusCode: CreateComplaintStatusCodeDto): Promise<ComplaintStatusCode> {
    const newComplaintStatusCode = this.complaintStatusCodeRepository.create(complaintStatusCode);
    await this.complaintStatusCodeRepository.save(newComplaintStatusCode);
    return newComplaintStatusCode;
  }

  async findAll(): Promise<ComplaintStatusCode[]> {
    return this.complaintStatusCodeRepository.find();
  }

  async findOne(id: any): Promise<ComplaintStatusCode> {
    return this.complaintStatusCodeRepository.findOneByOrFail({ complaint_status_code: id });
  }

  async update(
    complaint_status_code: string,
    updateComplaintStatusCodeDto: UpdateComplaintStatusCodeDto,
  ): Promise<ComplaintStatusCode> {
    await this.complaintStatusCodeRepository.update({ complaint_status_code }, updateComplaintStatusCodeDto);
    return this.findOne(complaint_status_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.complaintStatusCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
