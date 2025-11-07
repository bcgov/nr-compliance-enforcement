import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";
import { StagingComplaint } from "../staging_complaint/entities/staging_complaint.entity";
import { ComplaintChangeCount } from "./entities/complaint_change_count";
import { ActionTaken } from "../complaint/entities/action_taken.entity";
import { RelatedDataDto } from "src/types/models/complaints/dtos/related-data";
import { ComplaintReferral } from "../complaint_referral/entities/complaint_referral.entity";
import { ComplaintReferralEmailLogService } from "../complaint_referral_email_log/complaint_referral_email_log.service";

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
    @Inject(ComplaintReferralEmailLogService)
    private readonly _complaintReferralEmailLogService: ComplaintReferralEmailLogService,
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
      select: {
        complaint_referral_guid: true,
        complaint_identifier: true,
        referred_by_agency_code_ref: true,
        referred_to_agency_code_ref: true,
        app_user_guid_ref: true,
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
    const referral_email_logs = await this._complaintReferralEmailLogService.findByComplaintReferralGuids(
      referrals.map((ref) => ref.complaint_referral_guid),
    );

    let fullResults: RelatedDataDto = {
      updates: updates,
      actions: actions,
      referrals: referrals,
      referral_email_logs: referral_email_logs,
    };
    return fullResults;
  };
  getComplaintChangeCount(id: string): Promise<ComplaintChangeCount[]> {
    return this.stagingComplaintRepository.manager.query(
      `select count(1) as value from complaint.staging_complaint where complaint_identifier = $1 
      and (staging_activity_code in ('EDIT', 'UPDATE') and staging_status_code = 'SUCCESS')`,
      [id],
    );
  }
}
