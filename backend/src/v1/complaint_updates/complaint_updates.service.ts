import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";

@Injectable()
export class ComplaintUpdatesService {
  constructor(
    @InjectRepository(ComplaintUpdate)
    private complaintUpdatesRepository: Repository<ComplaintUpdate>,
  ) {}

  findByComplaintId(id: string): Promise<ComplaintUpdate[]> {
    return this.complaintUpdatesRepository.find({
      where: {
        complaintIdentifier: {
          complaint_identifier: id,
        },
      },
    });
  }
}
