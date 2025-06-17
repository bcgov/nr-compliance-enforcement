import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { ChesService } from "../../external_api/ches/ches.service";
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
import { GenerateCollaboratorEmailParams, generateCollaboratorEmailBody } from "../../email_templates/collaborator";
import { CssService } from "../../external_api/css/css.service";
import { SendCollaboratorEmalDto } from "../../v1/email/dto/send_collaborator_email.dto";
import { OfficerService } from "../../v1/officer/officer.service";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly _chesService: ChesService,
    private readonly _emailReferenceService: EmailReferenceService,
    @Inject(forwardRef(() => ComplaintService))
    private readonly _complaintService: ComplaintService,
    private readonly _speciesCodeService: SpeciesCodeService,
    private readonly _natureOfComplaintService: HwcrComplaintNatureCodeService,
    private readonly _geoOrganizationUnitCodeService: GeoOrganizationUnitCodeService,
    private readonly _agencyCodeService: AgencyCodeService,
    private readonly _violationCodeService: ViolationCodeService,
    private readonly _girTypeCodeService: GirTypeCodeService,
    private readonly _cssService: CssService,
    private readonly _officerService: OfficerService,
  ) {}

  private async _buildRecipientList(externalAgencyInd, referredToAgencyCode, complaint, additionalRecipients) {
    const recipientList = [...additionalRecipients];
    if (externalAgencyInd) return recipientList;

    const emailReferences = await this._emailReferenceService.findActiveByAgency(referredToAgencyCode);
    for (const ref of emailReferences) {
      switch (referredToAgencyCode) {
        case "COS":
          if (ref.geo_organization_unit_code === complaint.organization.zone) {
            recipientList.push(ref.email_address);
          }
          break;
        case "EPO":
        case "PARKS":
          recipientList.push(ref.email_address);
          break;
        default: {
          break;
        }
      }
    }
    return recipientList;
  }

  private async _getComplaintDetailsByType(type, complaint, communityName) {
    let subjectTypeDescription = type;
    let bodyTypeDescription = type;
    let complaintSummaryText = "";
    let subjectAdditionalDetails = "";

    switch (type) {
      case "HWCR": {
        subjectTypeDescription = "HWC";
        bodyTypeDescription = "Human wildlife conflict";
        const wildlifeComplaint = complaint as WildlifeComplaintDto;
        const speciesName = (await this._speciesCodeService.findOne(wildlifeComplaint.species)).short_description;
        const natureOfComplaint = (await this._natureOfComplaintService.findOne(wildlifeComplaint.natureOfComplaint))
          .long_description;
        complaintSummaryText = `${bodyTypeDescription}, ${natureOfComplaint}, ${speciesName}, ${communityName}`;
        subjectAdditionalDetails = `(${speciesName}, ${communityName})`;
        break;
      }
      case "ERS": {
        subjectTypeDescription = "Enforcement";
        bodyTypeDescription = "Enforcement";
        const ersComplaint = complaint as AllegationComplaintDto;
        const violationCodeName = (await this._violationCodeService.findOne(ersComplaint.violation)).long_description;
        const inProgressText = ersComplaint.isInProgress ? "Violation in progress, " : "";
        complaintSummaryText = `${bodyTypeDescription}, ${violationCodeName}, ${inProgressText}${communityName}`;
        subjectAdditionalDetails = `(${violationCodeName}, ${
          ersComplaint.isInProgress ? "In progress, " : ""
        }${communityName})`;
        break;
      }
      case "GIR": {
        subjectTypeDescription = "General incident";
        bodyTypeDescription = "General incident";
        const girComplaint = complaint as GeneralIncidentComplaintDto;
        const girTypeName = (await this._girTypeCodeService.findOne(girComplaint.girType)).long_description;
        complaintSummaryText = `${bodyTypeDescription}, ${girTypeName}, ${communityName}`;
        subjectAdditionalDetails = `(${girTypeName}, ${communityName})`;
        break;
      }
    }

    return { subjectTypeDescription, bodyTypeDescription, complaintSummaryText, subjectAdditionalDetails };
  }

  sendReferralEmail = async (createComplaintReferralDto, user, exportContentBuffer) => {
    const {
      complaint_identifier: id,
      referred_to_agency_code,
      referred_by_agency_code,
      referral_reason,
      complaint_url,
      additionalEmailRecipients,
      externalAgencyInd,
    } = createComplaintReferralDto;
    const { type, fileName } = createComplaintReferralDto.documentExportParams;

    try {
      const complaint = await this._complaintService.findById(id, type);

      const base64Content = Buffer.from(exportContentBuffer.data).toString("base64");
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

      const recipientList = await this._buildRecipientList(
        externalAgencyInd,
        referred_to_agency_code,
        complaint,
        additionalEmailRecipients,
      );

      const { short_description: communityName } = await this._geoOrganizationUnitCodeService.findOne(
        complaint.organization.area,
      );
      const referredToAgency = await this._agencyCodeService.findById(referred_to_agency_code);
      const referredByAgency = await this._agencyCodeService.findById(referred_by_agency_code);

      const { subjectTypeDescription, bodyTypeDescription, complaintSummaryText, subjectAdditionalDetails } =
        await this._getComplaintDetailsByType(type, complaint, communityName);

      const envFlag = ["dev", "test"].includes(process.env.ENVIRONMENT) ? "<TEST> " : "";
      const emailSubject = externalAgencyInd
        ? `${envFlag}Referral from ${referredByAgency.long_description}: ${subjectTypeDescription} complaint #${id}`
        : `${envFlag}NatCom referral ${subjectTypeDescription} complaint #${id} ${subjectAdditionalDetails}`;

      const generateReferralEmailParams = {
        complaintId: id,
        complaintTypeDescription: bodyTypeDescription,
        senderName,
        senderEmailAddress,
        referredToAgency: referredToAgency.long_description,
        referredByAgency: referredByAgency.long_description,
        reasonForReferral: referral_reason,
        supportEmail,
        complaintSummaryText,
        complaintUrl: complaint_url,
        isExternal: externalAgencyInd,
      };

      const emailBody = generateReferralEmailBody(generateReferralEmailParams);

      return await this._chesService.sendEmail(
        senderEmailAddress,
        senderName,
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

  sendCollaboratorEmail = async (complaintId, sendCollaboratorEmailDto: SendCollaboratorEmalDto, user) => {
    try {
      const { complaintType, personGuid, complaintUrl } = sendCollaboratorEmailDto;
      const senderEmailAddress = user.email ?? process.env.CEDS_EMAIL;
      const supportEmail = process.env.CEDS_EMAIL;
      const { given_name, family_name } = user;
      const senderName = `${family_name} ${given_name}`;
      const collaboratorOfficer = await this._officerService.findByPersonGuid(personGuid);
      const collaboratorUserRes = await this._cssService.getUserByGuid(
        collaboratorOfficer.auth_user_guid.replace(/-/g, ""),
      );
      const collaborator = collaboratorUserRes[0];
      const { email, lastName, firstName } = collaborator;
      const collaboratorName = `${firstName} ${lastName}`;
      const complaint = await this._complaintService.findById(complaintId, complaintType);

      const { short_description: owningAgency } = await this._agencyCodeService.findById(complaint.ownedBy);
      let subjectAdditionalDetails = "";
      let complaintSummaryText = "";
      let subjectTypeDescription = `${complaintType}`;
      let complaintTypeDescription = `${complaintType}`;
      switch (complaintType) {
        case "HWCR": {
          const complaintAsWildlife = complaint as WildlifeComplaintDto;
          subjectTypeDescription = "HWC";
          complaintTypeDescription = "Human wildlife conflict";
          const { short_description: speciesName } = await this._speciesCodeService.findOne(
            complaintAsWildlife.species,
          );
          const { long_description: natureOfComplaint } = await this._natureOfComplaintService.findOne(
            complaintAsWildlife.natureOfComplaint,
          );
          complaintSummaryText = `${natureOfComplaint}, ${speciesName}`;
          subjectAdditionalDetails = `(${speciesName})`;
          break;
        }
        case "ERS": {
          const complaintAsErs = complaint as AllegationComplaintDto;
          subjectTypeDescription = "Enforcement";
          complaintTypeDescription = "Enforcement";
          const { long_description: violationCodeName } = await this._violationCodeService.findOne(
            complaintAsErs.violation,
          );
          const { isInProgress } = complaintAsErs;
          complaintSummaryText = `${violationCodeName}${isInProgress === true ? ", violation in progress" : ""}`;
          subjectAdditionalDetails = `(${violationCodeName})`;
          break;
        }
        case "GIR": {
          const complaintAsGir = complaint as GeneralIncidentComplaintDto;
          subjectTypeDescription = "General incident";
          complaintTypeDescription = "General incident";
          const { long_description: girTypeName } = await this._girTypeCodeService.findOne(complaintAsGir.girType);
          complaintSummaryText = `${girTypeName}`;
          subjectAdditionalDetails = `(${girTypeName})`;
          break;
        }
      }
      const envFlag = ["dev", "test"].includes(process.env.ENVIRONMENT) ? "<TEST> " : "";
      const emailSubject = `${envFlag}Invitation to collaborate: NatCom ${subjectTypeDescription} complaint #${complaintId} ${subjectAdditionalDetails}`;
      const generateCollaboratorEmailParams: GenerateCollaboratorEmailParams = {
        complaintId,
        collaboratorName,
        complaintTypeDescription,
        owningAgency,
        senderName,
        senderEmailAddress,
        supportEmail,
        complaintSummaryText,
        complaintUrl,
      };
      const emailBody = generateCollaboratorEmailBody(generateCollaboratorEmailParams);
      return await this._chesService.sendEmail(
        senderEmailAddress,
        senderName,
        emailSubject,
        emailBody,
        [email],
        [senderEmailAddress],
      );
    } catch (error) {
      this.logger.error(`Failed to send collaborator email: ${error.message}`);
      throw error;
    }
  };
}
