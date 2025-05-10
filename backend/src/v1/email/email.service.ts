import { Inject, Injectable, Logger } from "@nestjs/common";
import { ChesService } from "../../external_api/ches/ches.service";
import { DocumentService } from "../../v1/document/document.service";
import { generateReferralEmailBody, GenerateReferralEmailParams } from "../../email_templates/referrals";
import { EmailReferenceService } from "../../v1/email_reference/email_reference.service";
import { ComplaintService } from "../../v1/complaint/complaint.service";
import { WildlifeComplaintDto } from "../../types/models/complaints/wildlife-complaint";
import { SpeciesCodeService } from "../../v1/species_code/species_code.service";
import { HwcrComplaintNatureCodeService } from "../../v1/hwcr_complaint_nature_code/hwcr_complaint_nature_code.service";
import { AllegationComplaintDto } from "../../types/models/complaints/allegation-complaint";
import { GeoOrganizationUnitCodeService } from "../../v1/geo_organization_unit_code/geo_organization_unit_code.service";
import { AgencyCodeService } from "../../v1/agency_code/agency_code.service";
import { ViolationCodeService } from "../../v1/violation_code/violation_code.service";
import { GeneralIncidentComplaintDto } from "../../types/models/complaints/gir-complaint";
import { GirTypeCodeService } from "../../v1/gir_type_code/gir_type_code.service";

@Injectable()
export class EmailService {
  @Inject(ChesService)
  private readonly _chesService: ChesService;
  @Inject(DocumentService)
  private readonly _documentService: DocumentService;
  @Inject(EmailReferenceService)
  private readonly _emailReferenceService: EmailReferenceService;
  @Inject(ComplaintService)
  private readonly _complaintService: ComplaintService;
  @Inject(SpeciesCodeService)
  private readonly _speciesCodeService: SpeciesCodeService;
  @Inject(HwcrComplaintNatureCodeService)
  private readonly _natureOfComplaintService: HwcrComplaintNatureCodeService;
  @Inject(GeoOrganizationUnitCodeService)
  private readonly _geoOrganizationUnitCodeService: GeoOrganizationUnitCodeService;
  @Inject(AgencyCodeService)
  private readonly _agencyCodeService: AgencyCodeService;
  @Inject(ViolationCodeService)
  private readonly _violationCodeService: ViolationCodeService;
  @Inject(GirTypeCodeService)
  private readonly _girTypeCodeService: GirTypeCodeService;
  private readonly logger = new Logger(EmailService.name);

  sendReferralEmail = async (createComplaintReferralDto, token, user) => {
    try {
      const {
        complaint_identifier: id,
        referred_to_agency_code,
        referred_by_agency_code,
        referral_reason,
        complaint_url,
      } = createComplaintReferralDto;
      const { type, fileName, tz, attachments } = createComplaintReferralDto.documentExportParams;

      const complaint = await this._complaintService.findById(id, type);

      // Get the complaint export to be attached to the email
      const complaintExport = await this._documentService.exportComplaint(id, type, fileName, tz, attachments, token);
      // Convert the PDF data to base64
      const base64Content = Buffer.from(complaintExport.data).toString("base64");
      const emailAttachments = [
        {
          content: base64Content,
          contentType: "application/pdf",
          encoding: "base64",
          filename: fileName,
        },
      ];

      const senderEmailAddress = user.email ?? process.env.CEDS_EMAIL;
      const supportEmail = process.env.CEDS_EMAIL;
      const { given_name, family_name } = user;
      const senderName = `${given_name} ${family_name}`;

      const recipientList = [];
      const emailReferences = await this._emailReferenceService.findActiveByAgency(referred_to_agency_code);
      for (const ref of emailReferences) {
        switch (referred_to_agency_code) {
          case "COS": {
            if (ref.geo_organization_unit_code === complaint.organization.zone) {
              recipientList.push(ref.email_address);
            }
            break;
          }
          // Currently Parks and EPO only have a single shared inbox
          case "EPO": {
            recipientList.push(ref.email_address);
            break;
          }
          case "PARKS": {
            recipientList.push(ref.email_address);
            break;
          }
          default: {
            break;
          }
        }
      }

      const { short_description: communityName } = await this._geoOrganizationUnitCodeService.findOne(
        complaint.organization.area,
      );
      const { short_description: referredToAgencyName } = await this._agencyCodeService.findById(
        referred_to_agency_code,
      );
      const { short_description: referredByAgencyName } = await this._agencyCodeService.findById(
        referred_by_agency_code,
      );
      let subjectAdditionalDetails = "";
      let complaintSummaryText = "";

      switch (type) {
        case "HWCR": {
          const complaintAsWildlife = complaint as WildlifeComplaintDto;
          const { short_description: speciesName } = await this._speciesCodeService.findOne(
            complaintAsWildlife.species,
          );
          const { long_description: natureOfComplaint } = await this._natureOfComplaintService.findOne(
            complaintAsWildlife.natureOfComplaint,
          );
          complaintSummaryText = `${type}, ${natureOfComplaint}, ${speciesName}, ${communityName}`;
          subjectAdditionalDetails = `(${speciesName}, ${communityName})`;
          break;
        }
        case "ERS": {
          const complaintAsErs = complaint as AllegationComplaintDto;
          const { long_description: violationCodeName } = await this._violationCodeService.findOne(
            complaintAsErs.violation,
          );
          const { isInProgress } = complaintAsErs;
          complaintSummaryText = `${violationCodeName}, ${
            isInProgress === true ? "Violation in progress, " : ""
          }${communityName}`;
          subjectAdditionalDetails = `(${violationCodeName}, ${
            isInProgress === true ? "In progress, " : ""
          }${communityName})`;
          break;
        }
        case "GIR": {
          const complaintAsGir = complaint as GeneralIncidentComplaintDto;
          const { long_description: girTypeName } = await this._girTypeCodeService.findOne(complaintAsGir.girType);
          complaintSummaryText = `${type}, ${girTypeName}, ${communityName}`;
          subjectAdditionalDetails = `(${girTypeName}, ${communityName})`;
          break;
        }
      }
      const envFlag = ["dev", "test"].includes(process.env.ENVIRONMENT) ? "<TEST> " : null;
      const emailSubject = `${envFlag}NatCom referral ${type} complaint #${id} ${subjectAdditionalDetails}`;
      const generateReferralEmailParams: GenerateReferralEmailParams = {
        complaintId: id,
        complaintType: type,
        senderName: senderName,
        senderEmailAddress: senderEmailAddress,
        referredToAgency: referredToAgencyName,
        referredByAgency: referredByAgencyName,
        reasonForReferral: referral_reason,
        supportEmail: supportEmail,
        complaintSummaryText: complaintSummaryText,
        complaintUrl: complaint_url,
      };
      const emailBody = generateReferralEmailBody(generateReferralEmailParams);

      return await this._chesService.sendEmail(
        senderEmailAddress,
        emailSubject,
        emailBody,
        recipientList,
        [senderEmailAddress],
        emailAttachments,
      );
    } catch (error) {
      this.logger.error(`Failed to send referral email: ${error.message}`);
      throw error;
    }
  };
}
