import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";
import { ComplaintUpdatesDto } from "src/types/models/complaint-updates/complaint-updates";

@Injectable()
export class ComplaintUpdatesService {
  constructor(
    @InjectRepository(ComplaintUpdate)
    private complaintUpdatesRepository: Repository<ComplaintUpdate>,
  ) {}

  findAll() {
    return this.complaintUpdatesRepository.find();
  }

  update(id: number, updateComplaintUpdatesDto: ComplaintUpdatesDto) {
    return `This action updates a #${id} configuration`;
  }
}
