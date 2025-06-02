import { Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ComplaintReferralEmailLog } from "./entities/complaint_referral_email_log.entity";
import { CreateComplaintReferralEmailLogDto } from "./dto/create-complaint_referral_email_log.dto";

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
      return this.complaintReferralEmailLogRepository.create(createComplaintReferralEmailLogDto);
    } catch (error) {
      this.logger.error("Error creating complaint referral email log.", error);
      throw new Error("Error creating complaint referral email log.", error);
    }
  }
}
