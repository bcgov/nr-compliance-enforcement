import { Repository } from "typeorm";
import { Injectable, Logger, Inject, Scope, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ComplaintReferral } from "./entities/complaint_referral.entity";
import { Complaint } from "./../complaint/entities/complaint.entity";
import { getIdirFromRequest } from "../../common/get-idir-from-request";
import { REQUEST } from "@nestjs/core";
import { PersonComplaintXrefService } from "../person_complaint_xref/person_complaint_xref.service";
import { EmailService } from "../../v1/email/email.service";
import { FeatureFlagService } from "../../v1/feature_flag/feature_flag.service";
import { DocumentService } from "../../v1/document/document.service";

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
    @Inject(DocumentService)
    private readonly _documentService: DocumentService,
  ) {}

  private readonly logger = new Logger(ComplaintReferralService.name);

  async create(createComplaintReferralDto: any, token: string, user): Promise<ComplaintReferral> {
    // FEATURE FLAG check
    // If both agencies involved have the feature flag active, send the referral email notification
    const referredByActive = await this._featureFlagService.checkActiveByAgencyAndFeatureCode(
      createComplaintReferralDto.referred_by_agency_code,
      "REFEMAIL",
    );
    const referredToActive = await this._featureFlagService.checkActiveByAgencyAndFeatureCode(
      createComplaintReferralDto.referred_to_agency_code,
      "REFEMAIL",
    );
    const sendEmail = referredByActive && referredToActive;
    const idir = getIdirFromRequest(this.request);
    createComplaintReferralDto.create_user_id = idir;
    createComplaintReferralDto.update_user_id = idir;

    const { complaint_identifier: id, referred_to_agency_code, externalAgencyInd } = createComplaintReferralDto;
    const { type, fileName, tz, attachments } = createComplaintReferralDto.documentExportParams;
    // Generate the document export from the referring agency if sending the referral email
    let complaintExport;
    if (sendEmail) {
      complaintExport = await this._documentService.exportComplaint(id, type, fileName, tz, attachments, token);
    }

    const newComplaintReferral = this.complaintReferralRepository.create(createComplaintReferralDto);
    const result: any = await this.complaintReferralRepository.save(newComplaintReferral);

    if (result.complaint_referral_guid) {
      const updateData: any = {
        owned_by_agency_code: referred_to_agency_code,
        comp_last_upd_utc_timestamp: new Date(),
      };
      if (externalAgencyInd) {
        updateData.complaint_status_code = "CLOSED";
        updateData.comp_last_upd_utc_timestamp = new Date();
      }

      await this.complaintRepository.update({ complaint_identifier: id }, updateData);
    }
    // Clear the officer assigend to the complaint
    this._personService.clearAssignedOfficer(createComplaintReferralDto.complaint_identifier);

    if (sendEmail) {
      // Email the appropriate recipient
      await this._emailService.sendReferralEmail(createComplaintReferralDto, user, complaintExport);
    }

    return result;
  }
}
