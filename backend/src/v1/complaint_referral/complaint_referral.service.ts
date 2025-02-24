import { Repository } from "typeorm";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateComplaintReferralDto } from "./dto/create-complaint_referral.dto";
import { ComplaintReferral } from "./entities/complaint_referral.entity";

@Injectable()
export class ComplaintReferralService {
  @InjectRepository(ComplaintReferral)
  private readonly complaintReferralRepository: Repository<ComplaintReferral>;

  private readonly logger = new Logger(ComplaintReferralService.name);

  async create(createComplaintReferralDto: CreateComplaintReferralDto): Promise<ComplaintReferral> {
    const newComplaintReferral = this.complaintReferralRepository.create(createComplaintReferralDto);
    await this.complaintReferralRepository.save(newComplaintReferral);
    return newComplaintReferral;
  }

  async findByComplaintId(id: string): Promise<ComplaintReferral[]> {
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
        },
        referred_to_agency_code: {
          agency_code: true,
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
}
