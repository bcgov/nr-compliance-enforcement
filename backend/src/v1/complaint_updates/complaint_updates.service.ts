import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { ComplaintChangeCount } from "./entities/complaint_change_count";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { RelatedDataDto } from "src/types/models/complaints/related-data";

@Injectable()
export class ComplaintUpdatesService {
  constructor(
    @InjectRepository(ComplaintUpdate)
    private complaintUpdatesRepository: Repository<ComplaintUpdate>,
    @InjectRepository(StagingComplaint)
    private stagingComplaintRepository: Repository<StagingComplaint>,
    @InjectRepository(ActionTaken)
    private actionTakenRepository: Repository<ActionTaken>,
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
  findActionsByComplaintId(id: string): Promise<ActionTaken[]> {
    return this.actionTakenRepository.find({
      where: {
        complaintIdentifier: {
          complaint_identifier: id,
        },
      },
      order: {
        actionUtcTimestamp: "DESC",
      },
    });
  }
  findRelatedDataById = async (id: string): Promise<RelatedDataDto> => {
    const updates = await this.findByComplaintId(id);
    const actions = await this.findActionsByComplaintId(id);

    let fullResults: RelatedDataDto = { updates: updates, actions: actions };
    return fullResults;
  };
  getComplaintChangeCount(id: string): Promise<ComplaintChangeCount[]> {
    return this.stagingComplaintRepository.manager.query(
      `select count(1) as value from public.staging_complaint where complaint_identifier = $1 
      and (staging_activity_code in ('EDIT', 'UPDATE') and staging_status_code = 'SUCCESS')`,
      [id],
    );
  }
}
