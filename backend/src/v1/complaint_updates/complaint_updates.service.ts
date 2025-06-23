import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { ComplaintChangeCount } from "./entities/complaint_change_count";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { RelatedDataDto } from "src/types/models/complaints/dtos/related-data";
import { ComplaintReferral } from "../complaint_referral/entities/complaint_referral.entity";

@Injectable()
export class ComplaintUpdatesService {
  constructor(
    @InjectRepository(ComplaintUpdate)
    private readonly complaintUpdatesRepository: Repository<ComplaintUpdate>,
    @InjectRepository(StagingComplaint)
    private readonly stagingComplaintRepository: Repository<StagingComplaint>,
    @InjectRepository(ActionTaken)
    private readonly actionTakenRepository: Repository<ActionTaken>,
    @InjectRepository(ComplaintReferral)
    private readonly complaintReferralRepository: Repository<ComplaintReferral>,
  ) {}

  findByComplaintId(id: string): Promise<ComplaintUpdate[]> {
    return this.complaintUpdatesRepository.find({
      where: {
        complaintIdentifier: {
          complaint_identifier: id,
        },
      },
      relations: {
        reported_by_code: true,
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

  async findReferralUpdatesByComplaintId(id: string): Promise<ComplaintReferral[]> {
    const result = await this.complaintReferralRepository.find({
      where: {
        complaint_identifier: id,
      },
      relations: {
        referred_by_agency_code: true,
        referred_to_agency_code: true,
        officer_guid: {
          person_guid: true,
        },
      },
      select: {
        complaint_referral_guid: true,
        complaint_identifier: true,
        referred_by_agency_code: {
          agency_code: true,
          long_description: true,
        },
        referred_to_agency_code: {
          agency_code: true,
          long_description: true,
        },
        officer_guid: {
          officer_guid: true,
          person_guid: {
            last_name: true,
            first_name: true,
          },
        },
        referral_date: true,
        referral_reason: true,
      },
      order: {
        referral_date: "DESC",
      },
    });
    return result;
  }

  findRelatedDataById = async (id: string): Promise<RelatedDataDto> => {
    const updates = await this.findByComplaintId(id);
    const actions = await this.findActionsByComplaintId(id);
    const referrals = await this.findReferralUpdatesByComplaintId(id);

    let fullResults: RelatedDataDto = { updates: updates, actions: actions, referrals: referrals };
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
