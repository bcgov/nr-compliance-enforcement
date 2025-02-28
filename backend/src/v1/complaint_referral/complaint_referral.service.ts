import { Repository } from "typeorm";
import { Injectable, Logger, Inject, Scope, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ComplaintReferral } from "./entities/complaint_referral.entity";
import { Complaint } from "./../complaint/entities/complaint.entity";
import { getIdirFromRequest } from "../../common/get-idir-from-request";
import { REQUEST } from "@nestjs/core";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";

@Injectable({ scope: Scope.REQUEST })
export class ComplaintReferralService {
  @InjectRepository(ComplaintReferral)
  private readonly complaintReferralRepository: Repository<ComplaintReferral>;
  @InjectRepository(Complaint)
  private readonly complaintRepository: Repository<Complaint>;

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @Inject(forwardRef(() => PersonComplaintXrefService))
    private readonly _personService: PersonComplaintXrefService,
  ) {}

  private readonly logger = new Logger(ComplaintReferralService.name);

  async create(createComplaintReferralDto: any): Promise<ComplaintReferral> {
    const idir = getIdirFromRequest(this.request);
    createComplaintReferralDto.create_user_id = idir;
    createComplaintReferralDto.update_user_id = idir;

    const newComplaintReferral = this.complaintReferralRepository.create(createComplaintReferralDto);
    const result: any = await this.complaintReferralRepository.save(newComplaintReferral);

    //Update owned_by_agency_code in complaint table
    if (result.complaint_referral_guid) {
      await this.complaintRepository.update(
        { complaint_identifier: createComplaintReferralDto.complaint_identifier },
        { owned_by_agency_code: createComplaintReferralDto.referred_to_agency_code },
      );
    }

    // Clear the officer assigend to the complaint
    this._personService.clearAssignedOfficer(createComplaintReferralDto.complaint_identifier);

    return result;
  }
}
