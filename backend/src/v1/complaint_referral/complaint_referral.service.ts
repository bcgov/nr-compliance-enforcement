import { Repository } from "typeorm";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ComplaintReferral } from "./entities/complaint_referral.entity";
import { Complaint } from "./../complaint/entities/complaint.entity";

@Injectable()
export class ComplaintReferralService {
  @InjectRepository(ComplaintReferral)
  private readonly complaintReferralRepository: Repository<ComplaintReferral>;
  @InjectRepository(Complaint)
  private readonly complaintRepository: Repository<Complaint>;

  private readonly logger = new Logger(ComplaintReferralService.name);

  async create(createComplaintReferralDto: any): Promise<ComplaintReferral> {
    const newComplaintReferral = this.complaintReferralRepository.create(createComplaintReferralDto);
    const result: any = await this.complaintReferralRepository.save(newComplaintReferral);

    //Update owned_by_agency_code in complaint table
    if (result.complaint_referral_guid) {
      await this.complaintRepository.update(
        { complaint_identifier: createComplaintReferralDto.complaint_identifier },
        { owned_by_agency_code: createComplaintReferralDto.referred_to_agency_code },
      );
    }
    return result;
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
