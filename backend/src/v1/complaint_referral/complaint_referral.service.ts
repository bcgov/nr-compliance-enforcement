import { Repository } from "typeorm";
import { Injectable, Logger, Inject, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ComplaintReferral } from "./entities/complaint_referral.entity";
import { Complaint } from "./../complaint/entities/complaint.entity";
import { getIdirFromRequest } from "../../common/get-idir-from-request";
import { REQUEST } from "@nestjs/core";
import { AppUserComplaintXref } from "../app_user_complaint_xref/entities/app_user_complaint_xref.entity";
import { EmailService } from "../../v1/email/email.service";
import { FeatureFlagService } from "../../v1/feature_flag/feature_flag.service";
import { DocumentService } from "../../v1/document/document.service";
import { ComplaintService } from "../complaint/complaint.service";
import { ComplaintReferralEmailLogService } from "../complaint_referral_email_log/complaint_referral_email_log.service";
import { CreateComplaintReferralEmailLogDto } from "../complaint_referral_email_log/dto/create-complaint_referral_email_log.dto";
import { randomUUID } from "node:crypto";
import { asUUID } from "src/common/methods";

@Injectable({ scope: Scope.REQUEST })
export class ComplaintReferralService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @Inject(EmailService)
    private readonly _emailService: EmailService,
    @Inject(FeatureFlagService)
    private readonly _featureFlagService: FeatureFlagService,
    @Inject(DocumentService)
    private readonly _documentService: DocumentService,
    @Inject(ComplaintService)
    private readonly _complaintService: ComplaintService,
    @Inject(ComplaintReferralEmailLogService)
    private readonly _complaintReferralEmailLogService: ComplaintReferralEmailLogService,
    @InjectRepository(ComplaintReferral)
    private readonly complaintReferralRepository: Repository<ComplaintReferral>,
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
    @InjectRepository(AppUserComplaintXref)
    private readonly appUserComplaintXrefRepository: Repository<AppUserComplaintXref>,
  ) {}

  private readonly logger = new Logger(ComplaintReferralService.name);

  async create(createComplaintReferralDto: any, token: string, user): Promise<ComplaintReferral> {
    // FEATURE FLAG check
    // If both agencies involved have the feature flag active, send the referral email notification
    const referredByActive = await this._featureFlagService.checkActiveByAgencyAndFeatureCode(
      createComplaintReferralDto.referred_by_agency_code_ref,
      "REFEMAIL",
    );
    const referredToActive = await this._featureFlagService.checkActiveByAgencyAndFeatureCode(
      createComplaintReferralDto.referred_to_agency_code_ref,
      "REFEMAIL",
    );
    const sendEmail = referredByActive && referredToActive;

    const idir = getIdirFromRequest(this.request);
    createComplaintReferralDto.create_user_id = idir;
    createComplaintReferralDto.update_user_id = idir;

    const { complaint_identifier: id, referred_to_agency_code_ref, externalAgencyInd } = createComplaintReferralDto;
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
        owned_by_agency_code_ref: referred_to_agency_code_ref,
        comp_last_upd_utc_timestamp: new Date(),
      };
      if (externalAgencyInd) {
        updateData.complaint_status_code = "CLOSED";
        updateData.comp_last_upd_utc_timestamp = new Date();
      }

      await this.complaintRepository.update({ complaint_identifier: id }, updateData);
    }
    // Clear the officer assigned to the complaint.
    await this.appUserComplaintXrefRepository.update(
      { complaint_identifier: id as any, app_user_complaint_xref_code: "ASSIGNEE" as any, active_ind: true },
      { active_ind: false, update_user_id: idir, update_utc_timestamp: new Date() },
    );

    if (sendEmail) {
      const senderEmail = user.email ?? process.env.CEDS_EMAIL;
      const { given_name, family_name } = user;
      const senderName = `${given_name} ${family_name}`;
      const complaint = await this._complaintService.findById(id, type, undefined, token);
      const recipientList = await this._emailService.sendReferralEmail(
        createComplaintReferralDto,
        complaint,
        senderEmail,
        senderName,
        complaintExport,
        token,
      );

      // Log the email recipients
      try {
        for (const emailAddress of recipientList) {
          const emailReferralLog: CreateComplaintReferralEmailLogDto = {
            complaint_referral_email_log_guid: asUUID(randomUUID()),
            email_address: emailAddress,
            email_sent_utc_timestamp: new Date(),
            create_user_id: idir,
            create_utc_timestamp: new Date(),
            update_user_id: idir,
            update_utc_timestamp: new Date(),
            complaint_referral_guid: result.complaint_referral_guid,
          };
          await this._complaintReferralEmailLogService.create(emailReferralLog);
        }
      } catch (error) {
        this.logger.error("Error creating one or more email logs", error instanceof Error ? error.stack : error);
      }
    }
    return result;
  }
}
