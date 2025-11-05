import { Injectable, Logger } from "@nestjs/common";
import { Repository, In } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ComplaintReferralEmailLog } from "./entities/complaint_referral_email_log.entity";
import { CreateComplaintReferralEmailLogDto } from "./dto/create-complaint_referral_email_log.dto";
import { UUID } from "node:crypto";

@Injectable()
export class ComplaintReferralEmailLogService {
  private readonly logger = new Logger(ComplaintReferralEmailLogService.name);
  @InjectRepository(ComplaintReferralEmailLog)
  private readonly complaintReferralEmailLogRepository: Repository<ComplaintReferralEmailLog>;

  constructor() {}

  async create(
    createComplaintReferralEmailLogDto: CreateComplaintReferralEmailLogDto,
  ): Promise<ComplaintReferralEmailLog> {
    try {
      const newComplaintReferralEmailLog = this.complaintReferralEmailLogRepository.create(
        createComplaintReferralEmailLogDto,
      );
      return await this.complaintReferralEmailLogRepository.save(newComplaintReferralEmailLog);
    } catch (error) {
      this.logger.error("Error creating complaint referral email log.", error);
      throw new Error("Error creating complaint referral email log.", error);
    }
  }

  async findByComplaintReferralGuids(complaintReferralGuids: UUID[]): Promise<ComplaintReferralEmailLog[]> {
    try {
      return await this.complaintReferralEmailLogRepository.find({
        relations: {
          complaint_referral_guid: true,
        },
        select: {
          complaint_referral_guid: { complaint_referral_guid: true },
          email_address: true,
          email_sent_utc_timestamp: true,
        },
        where: { complaint_referral_guid: In(complaintReferralGuids) },
        order: { email_sent_utc_timestamp: "DESC" },
      });
    } catch (error) {
      this.logger.error("Error finding complaint referral email logs.", error);
      throw new Error("Error finding complaint referral email logs.", error);
    }
  }
}
