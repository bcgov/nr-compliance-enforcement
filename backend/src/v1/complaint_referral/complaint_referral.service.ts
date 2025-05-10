import { Repository } from "typeorm";
import { Injectable, Logger, Inject, Scope, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ComplaintReferral } from "./entities/complaint_referral.entity";
import { Complaint } from "./../complaint/entities/complaint.entity";
import { getIdirFromRequest } from "../../common/get-idir-from-request";
import { REQUEST } from "@nestjs/core";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { EmailService } from "../../v1/email/email.service";
import { FeatureFlagService } from "src/v1/feature_flag/feature_flag.service";

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
    @Inject(EmailService)
    private readonly _emailService: EmailService,
    @Inject(FeatureFlagService)
    private readonly _featureFlagService: FeatureFlagService,
  ) {}

  private readonly logger = new Logger(ComplaintReferralService.name);

  async create(createComplaintReferralDto: any, token: string, user): Promise<ComplaintReferral> {
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

    // FEATURE FLAG
    // If both agencies involved have the feature flag active, send the referral email notification
    if (
      this._featureFlagService.checkActiveByAgencyAndFeatureCode(
        createComplaintReferralDto.referred_by_agency_code,
        "REFEMAIL",
      ) &&
      this._featureFlagService.checkActiveByAgencyAndFeatureCode(
        createComplaintReferralDto.referred_to_agency_code,
        "REFEMAIL",
      )
    ) {
      // Email the appropriate recipient
      await this._emailService.sendReferralEmail(createComplaintReferralDto, token, user);
    }

    return result;
  }
}
