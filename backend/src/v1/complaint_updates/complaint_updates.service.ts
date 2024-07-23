import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { ComplaintChangeCount } from "./entities/complaint_change_count";

@Injectable()
export class ComplaintUpdatesService {
  constructor(
    @InjectRepository(ComplaintUpdate)
    private complaintUpdatesRepository: Repository<ComplaintUpdate>,
    @InjectRepository(StagingComplaint)
    private stagingComplaintRepository: Repository<StagingComplaint>,
  ) {}

  findByComplaintId(id: string): Promise<ComplaintUpdate[]> {
    return this.complaintUpdatesRepository.find({
      where: {
        complaintIdentifier: {
          complaint_identifier: id,
        },
      },
      order: {
        updateSeqNumber: "DESC",
      },
    });
  }

  getComplaintChangeCount(id: string): Promise<ComplaintChangeCount[]> {
    return this.stagingComplaintRepository.manager.query(
      `select count(1) as value from public.staging_complaint where complaint_identifier = $1 
      and (staging_activity_code in ('EDIT', 'UPDATE') and staging_status_code = 'SUCCESS')`,
      [id],
    );
  }
}
