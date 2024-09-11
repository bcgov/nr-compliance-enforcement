import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComplaintMethodReceivedCode } from "./entities/complaint_method_received_code.entity";

@Injectable()
export class ComplaintMethodReceivedCodeService {
  constructor(
    @InjectRepository(ComplaintMethodReceivedCode)
    private complaintMethodReceivedCodeRepository: Repository<ComplaintMethodReceivedCode>,
  ) {}

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
}
