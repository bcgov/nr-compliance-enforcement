import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComplaintMethodReceivedCode } from "./entities/complaint_method_received_code.entity";
import { UpdateComplaintMethodReceivedCodeDto } from "./dto/update-complaint_method_received_code.dto";
import { ComplaintMethodReceivedCodeDto } from "./dto/complaint_method_received_code.dto";

@Injectable()
export class ComplaintMethodReceivedCodeService {
  constructor(
    @InjectRepository(ComplaintMethodReceivedCode)
    private complaintMethodReceivedCodeRepository: Repository<ComplaintMethodReceivedCode>,
  ) {}

  async create(complaint_method_received_code: ComplaintMethodReceivedCodeDto): Promise<ComplaintMethodReceivedCode> {
    const newComplaintMethodReceivedCode =
      this.complaintMethodReceivedCodeRepository.create(complaint_method_received_code);
    await this.complaintMethodReceivedCodeRepository.save(newComplaintMethodReceivedCode);
    return newComplaintMethodReceivedCode;
  }

  async findAll(): Promise<ComplaintMethodReceivedCode[]> {
    return this.complaintMethodReceivedCodeRepository.find({
      order: {
        display_order: "ASC",
      },
    });
  }

  async findOne(id: string): Promise<ComplaintMethodReceivedCode> {
    return this.complaintMethodReceivedCodeRepository.findOneByOrFail({ complaint_method_received_code: id });
  }

  async update(
    complaint_method_received_code: string,
    updateComplaintMethodReceivedCodeDto: UpdateComplaintMethodReceivedCodeDto,
  ): Promise<ComplaintMethodReceivedCode> {
    await this.complaintMethodReceivedCodeRepository.update(
      { complaint_method_received_code: complaint_method_received_code },
      updateComplaintMethodReceivedCodeDto,
    );
    return this.findOne(complaint_method_received_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.complaintMethodReceivedCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
