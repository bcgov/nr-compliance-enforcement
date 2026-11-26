import { Injectable, Logger } from "@nestjs/common";
import { ChesService } from "../../external_api/ches/ches.service";
import { generateReferralEmailBody } from "../../email_templates/referrals";
import { EmailReferenceService } from "../../v1/email_reference/email_reference.service";
import { WildlifeComplaintDto } from "../../types/models/complaints/dtos/wildlife-complaint";
import { HwcrComplaintNatureCodeService } from "../../v1/hwcr_complaint_nature_code/hwcr_complaint_nature_code.service";
import { AllegationComplaintDto } from "../../types/models/complaints/dtos/allegation-complaint";
import { ViolationCodeService } from "../../v1/violation_code/violation_code.service";
import { GeneralIncidentComplaintDto } from "../../types/models/complaints/dtos/gir-complaint";
import { GirTypeCodeService } from "../../v1/gir_type_code/gir_type_code.service";
import { GenerateCollaboratorEmailParams, generateCollaboratorEmailBody } from "../../email_templates/collaborator";
import { CssService } from "../../external_api/css/css.service";
import { SendCollaboratorEmalDto } from "../../v1/email/dto/send_collaborator_email.dto";
import { AppUserService } from "../../v1/app_user/app_user.service";
import { CodeTableService } from "../code-table/code-table.service";
import { getCosCommunityWithApiKey, getCosGeoOrgUnits, getParkNameWithApiKey } from "../../external_api/shared_data";
import { generateNewComplaintEmailBody, NewComplaintEmailAttachment } from "../../email_templates/new_chefs_complaint";
import { ChefsService } from "../../external_api/chefs/chefs.service";
import { UUID } from "node:crypto";
import {
  buildComplaintUrl,
  buildNewComplaintDetails,
  COMPLAINT_TYPE_DESCRIPTIONS,
  formatFileSize,
  getAttachmentLimitBytes,
  NewComplaintAttachment,
  planAttachments,
  NewComplaintNotification,
  selectNewComplaintRecipients,
  shouldEmailAttachments,
} from "./new-complaint-notification";
import { FeatureFlagService } from "../../v1/feature_flag/feature_flag.service";
import { SendInvestigationCollaboratorEmailDto } from "../../v1/email/dto/send_investigation_collaborator_email.dto";
import { getInvestigationByGuid } from "../../external_api/investigation_data";
import {
  GenerateInvestigationCollaboratorEmailParams,
  generateInvestigationCollaboratorEmailBody,
} from "../../email_templates/investigation-collaborator";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly _chesService: ChesService,
    private readonly _emailReferenceService: EmailReferenceService,
    private readonly _natureOfComplaintService: HwcrComplaintNatureCodeService,
    private readonly _violationCodeService: ViolationCodeService,
    private readonly _girTypeCodeService: GirTypeCodeService,
    private readonly _cssService: CssService,
    private readonly _appUserService: AppUserService,
    private readonly _codeTableService: CodeTableService,
    private readonly _featureFlagService: FeatureFlagService,
    private readonly _chefsService: ChefsService,
  ) {}

  private async _buildRecipientList(referredToAgencyCode, complaint, additionalRecipients) {
    const recipientList = [...(additionalRecipients || [])];

    const emailReferences = await this._emailReferenceService.findActiveByAgency(referredToAgencyCode);
    for (const ref of emailReferences) {
      if (!ref.geo_organization_unit_code || ref.geo_organization_unit_code === complaint.organization?.zone) {
        recipientList.push(ref.email_address);
      }
    }
    return recipientList;
  }

  private async _getComplaintDetailsByType(type, complaint, communityName, token) {
    let subjectTypeDescription = type;
    let bodyTypeDescription = type;
    let complaintSummaryText = "";
    let subjectAdditionalDetails = "";

    switch (type) {
      case "HWCR": {
        subjectTypeDescription = "HWC";
        bodyTypeDescription = "Human wildlife conflict";
        const wildlifeComplaint = complaint as WildlifeComplaintDto;
        // Convert species code from shared
        const speciesTable = await this._codeTableService.getCodeTableByName("species", token);
        const speciesName = speciesTable?.find(
          (item: any) => item.species === wildlifeComplaint.species,
        )?.shortDescription;
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

  sendReferralEmail = async (
    createComplaintReferralDto,
    isExternal,
    complaint,
    senderEmailAddress,
    senderName,
    exportContentBuffer,
    token,
  ) => {
    const {
      complaint_identifier: id,
      referred_to_agency_code_ref,
      referred_by_agency_code_ref,
      referral_reason,
      app_user_guid_ref,
      complaint_url,
      additionalEmailRecipients,
    } = createComplaintReferralDto;

    const { type, fileName } = createComplaintReferralDto.documentExportParams;
    try {
      const base64Content = Buffer.from(exportContentBuffer.data).toString("base64");
      const emailAttachments = [
        {
          content: base64Content,
          contentType: "application/pdf",
          encoding: "base64",
          filename: fileName,
        },
      ];

      const supportEmail = process.env.CEDS_EMAIL;
      const referringAppUser = await this._appUserService.findByAppUserGuid(app_user_guid_ref, token);
      const referringUserRes = await this._cssService.getUserByGuid(
        referringAppUser.auth_user_guid.replaceAll("-", ""),
      );
      const referringUser = referringUserRes[0];
      const { email, lastName, firstName } = referringUser;
      const referringUserEmail = email ?? process.env.CEDS_EMAIL;
      const referringUserName = `${firstName} ${lastName}`;

      const recipientList = await this._buildRecipientList(
        referred_to_agency_code_ref,
        complaint,
        additionalEmailRecipients,
      );

      let communityName = "";
      if (complaint.organization?.area) {
        try {
          const cosGeoOrgUnits = await getCosGeoOrgUnits(token);
          const orgUnit = cosGeoOrgUnits.find((unit: any) => unit.areaCode === complaint.organization.area);
          communityName = orgUnit?.areaName || "";
        } catch (error) {
          this.logger.error(`Failed to fetch community name from GraphQL: ${error}`);
          communityName = complaint.organization?.area || "";
        }
      } else {
        communityName = complaint.organization?.area || "";
      }

      const agencyTable = await this._codeTableService.getCodeTableByName("agency", token);
      const referredToAgency = agencyTable?.find(
        (agency: any) => agency.agency === referred_to_agency_code_ref,
      )?.longDescription;
      const referredByAgency = agencyTable?.find(
        (agency: any) => agency.agency === referred_by_agency_code_ref,
      )?.longDescription;

      const { subjectTypeDescription, bodyTypeDescription, complaintSummaryText, subjectAdditionalDetails } =
        await this._getComplaintDetailsByType(type, complaint, communityName, token);

      const envFlag = ["dev", "test"].includes(process.env.ENVIRONMENT) ? "<TEST> " : "";
      const emailSubject = isExternal
        ? `${envFlag}Referral from ${referredByAgency}: ${subjectTypeDescription} complaint #${id}`
        : `${envFlag}NatSuite referral ${subjectTypeDescription} complaint #${id} ${subjectAdditionalDetails}`;

      const generateReferralEmailParams = {
        complaintId: id,
        complaintTypeDescription: bodyTypeDescription,
        referringUserName,
        referringUserEmail,
        referredToAgency: referredToAgency,
        referredByAgency: referredByAgency,
        reasonForReferral: referral_reason,
        supportEmail,
        complaintSummaryText,
        complaintUrl: complaint_url,
        isExternal,
      };

      const emailBody = generateReferralEmailBody(generateReferralEmailParams);

      const ccList = Array.from(new Set([senderEmailAddress, referringUserEmail]));

      // Validate that we have at least one recipient
      if (!recipientList || recipientList.length === 0) {
        throw new Error(`No email recipients found for referral to ${referred_to_agency_code_ref}.`);
      }

      await this._chesService.sendEmail(
        senderEmailAddress,
        senderName,
        emailSubject,
        emailBody,
        recipientList,
        ccList,
        emailAttachments,
      );

      // Return all of the recipients including the CC list so each individual email can be logged
      const allRecipients = Array.from(new Set([...recipientList, ...ccList]));
      return allRecipients;
    } catch (error) {
      this.logger.error(`Failed to send referral email: ${error.message}`);
      throw error;
    }
  };

  sendCollaboratorEmail = async (
    complaintId,
    complaint,
    sendCollaboratorEmailDto: SendCollaboratorEmalDto,
    user,
    token: string,
  ) => {
    try {
      const { complaintType, appUserGuid, complaintUrl } = sendCollaboratorEmailDto;
      const senderEmailAddress = user.email ?? process.env.CEDS_EMAIL;
      const supportEmail = process.env.CEDS_EMAIL;
      const { given_name, family_name } = user;
      const senderName = `${family_name} ${given_name}`;
      const collaboratorAppUser = await this._appUserService.findByAppUserGuid(appUserGuid, token);
      const collaboratorUserRes = await this._cssService.getUserByGuid(
        collaboratorAppUser.auth_user_guid.replaceAll("-", ""),
      );
      const collaborator = collaboratorUserRes[0];
      const { email, lastName, firstName } = collaborator;
      const collaboratorName = `${firstName} ${lastName}`;
      const agencyTable = await this._codeTableService.getCodeTableByName("agency", token);
      const owningAgency = agencyTable?.find((agency: any) => agency.agency === complaint.ownedBy)?.shortDescription;
      let subjectAdditionalDetails = "";
      let complaintSummaryText = "";
      let subjectTypeDescription = `${complaintType}`;
      let complaintTypeDescription = `${complaintType}`;
      switch (complaintType) {
        case "HWCR": {
          const complaintAsWildlife = complaint as WildlifeComplaintDto;
          subjectTypeDescription = "HWC";
          complaintTypeDescription = "Human wildlife conflict";
          // Convert species code from shared
          const speciesTable = await this._codeTableService.getCodeTableByName("species", token);
          const speciesName = speciesTable?.find(
            (item: any) => item.species === complaintAsWildlife.species,
          )?.shortDescription;
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
      const emailSubject = `${envFlag}Invitation to collaborate: NatSuite ${subjectTypeDescription} complaint #${complaintId} ${subjectAdditionalDetails}`;
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

  // Notifies the business that a complaint submitted through CHEFS has been created in NatSuite.
  // Recipients come from email_reference, matched on the complaint's agency and zone.
  // Returns the addresses the email was sent to (empty if nobody is set up to receive it).
  sendNewComplaintNotification = async (notification: NewComplaintNotification): Promise<string[]> => {
    const { complaintId, complaintType, agencyCode, communityCode, parkGuid } = notification;

    let zoneCode: string | undefined;
    let communityName: string | undefined;
    if (communityCode) {
      try {
        const community = await getCosCommunityWithApiKey(communityCode);
        zoneCode = community?.zoneCode;
        communityName = community?.areaName;
      } catch (error) {
        this.logger.error(`Unable to look up community ${communityCode} for complaint ${complaintId}: ${error}`);
      }
    }

    let parkName: string | undefined;
    if (parkGuid) {
      try {
        parkName = await getParkNameWithApiKey(parkGuid);
      } catch (error) {
        this.logger.error(`Unable to look up park ${parkGuid} for complaint ${complaintId}: ${error}`);
      }
    }

    const emailReferences = await this._emailReferenceService.findActiveByAgency(agencyCode);
    const recipientList = selectNewComplaintRecipients(emailReferences, zoneCode);
    if (recipientList.length === 0) {
      this.logger.warn(`No email recipients for new complaint ${complaintId} (agency ${agencyCode}, zone ${zoneCode})`);
      return [];
    }

    const complaintTypeDescription = COMPLAINT_TYPE_DESCRIPTIONS[complaintType] ?? complaintType;
    const location = parkName ?? communityName ?? notification.submission?.cos_area_community;
    const envFlag = ["dev", "test"].includes(process.env.ENVIRONMENT) ? "<TEST> " : "";
    const emailSubject = `${envFlag}New ${complaintTypeDescription} complaint #${complaintId}${
      location ? ` (${location})` : ""
    }`;

    // Only NROS get the attachments (if any) by email
    const { emailAttachments, attachmentList } = shouldEmailAttachments(agencyCode)
      ? await this._getNewComplaintAttachments(complaintId, notification.submission?.attachments ?? [])
      : { emailAttachments: [], attachmentList: [] };

    const emailBody = generateNewComplaintEmailBody({
      complaintId,
      complaintTypeDescription,
      complaintUrl: buildComplaintUrl(complaintType, complaintId),
      details: buildNewComplaintDetails(notification, communityName, parkName),
      attachments: attachmentList,
      supportEmail: process.env.CEDS_EMAIL,
    });

    await this._chesService.sendEmail(
      process.env.CEDS_EMAIL,
      "NatSuite",
      emailSubject,
      emailBody,
      recipientList,
      [],
      emailAttachments,
      "new_complaint",
    );

    this.logger.debug(`Sent new complaint notification for ${complaintId} to ${recipientList.join(", ")}`);
    return recipientList;
  };

  sendInvestigationCollaboratorEmail = async (
    sendInvestigationCollaboratorEmailDto: SendInvestigationCollaboratorEmailDto,
    user,
    token: string,
  ) => {
    try {
      const { investigationGuid, appUserGuid, investigationUrl } = sendInvestigationCollaboratorEmailDto;
      const investigation = await getInvestigationByGuid(token, investigationGuid);

      // Only email users who are actually collaborators
      if (!investigation?.collaborators?.some((collaborator) => collaborator.appUserGuid === appUserGuid)) {
        return;
      }

      // Check if emailing collaborators is enabled for both agencies. This is done here because backend-cm currently has no access to see feature flags...
      // Could be refactored later to pull this logic into backend-cm, if we move flags to shared, but for now this avoids a circular dependency between
      // backend and backend-cm.
      const invitingAppUser = await this._appUserService.findByUserId(user.idir_username, token);
      const leadAgencyActive = await this._featureFlagService.checkActiveByAgencyAndFeatureCode(
        invitingAppUser.agency_code_ref,
        "COLEMAIL",
      );
      const collaboratorAppUser = await this._appUserService.findOne(appUserGuid, token);
      const collaboratorAgencyActive = await this._featureFlagService.checkActiveByAgencyAndFeatureCode(
        collaboratorAppUser.agency_code_ref,
        "COLEMAIL",
      );
      if (!leadAgencyActive || !collaboratorAgencyActive) {
        return;
      }
      const { name, leadAgency } = investigation;
      const senderEmailAddress = user.email ?? process.env.CEDS_EMAIL;
      const supportEmail = process.env.CEDS_EMAIL;
      const { given_name, family_name } = user;
      const senderName = `${family_name} ${given_name}`;
      const collaboratorUserRes = await this._cssService.getUserByGuid(
        collaboratorAppUser.auth_user_guid.replaceAll("-", ""),
      );
      const collaborator = collaboratorUserRes[0];
      const { email, lastName, firstName } = collaborator;
      const collaboratorName = `${firstName} ${lastName}`;
      const agencyTable = await this._codeTableService.getCodeTableByName("agency", token);
      const owningAgency = agencyTable?.find((agency: any) => agency.agency === leadAgency)?.shortDescription;
      const envFlag = ["dev", "test"].includes(process.env.ENVIRONMENT) ? "<TEST> " : "";
      const emailSubject = `${envFlag}Invitation to collaborate: NatSuite investigation #${name}`;
      const generateInvestigationCollaboratorEmailParams: GenerateInvestigationCollaboratorEmailParams = {
        name,
        collaboratorName,
        owningAgency,
        senderName,
        senderEmailAddress,
        supportEmail,
        investigationUrl,
      };
      const emailBody = generateInvestigationCollaboratorEmailBody(generateInvestigationCollaboratorEmailParams);
      await this._chesService.sendEmail(
        senderEmailAddress,
        senderName,
        emailSubject,
        emailBody,
        [email],
        [senderEmailAddress],
      );
    } catch (error) {
      this.logger.error(`Failed to send investigation collaborator email: ${error.message}`);
      throw error;
    }
  };

  // Downloads the submission's files from CHEFS to attach to the email. Files over the size limit, or that
  // can't be downloaded, are listed in the email instead so the notification still goes out.
  private async _getNewComplaintAttachments(
    complaintId: string,
    attachments: NewComplaintAttachment[],
  ): Promise<{ emailAttachments: any[]; attachmentList: NewComplaintEmailAttachment[] }> {
    const { toAttach, tooLarge } = planAttachments(attachments, getAttachmentLimitBytes());
    if (tooLarge.length > 0) {
      this.logger.warn(
        `Not attaching ${tooLarge.length} file(s) to the notification for ${complaintId}: over the size limit`,
      );
    }

    const downloads = await Promise.all(
      toAttach.map(async (attachment) => {
        try {
          const { data, headers } = await this._chefsService.getFile(attachment.id as UUID);
          return {
            content: Buffer.from(data),
            contentType: headers?.["content-type"] || "application/octet-stream",
            filename: attachment.name,
            id: attachment.id,
          };
        } catch (error) {
          this.logger.error(
            `Unable to get CHEFS file ${attachment.id} for the notification for ${complaintId}: ${error}`,
          );
          return undefined;
        }
      }),
    );

    const downloaded = downloads.filter((download) => download);
    const attachedIds = new Set(downloaded.map((download) => download.id));

    const emailAttachments = downloaded.map(({ content, contentType, filename }) => ({
      content: content.toString("base64"),
      contentType,
      encoding: "base64",
      filename,
    }));

    // List every file in the order it was submitted, noting the ones that aren't attached.
    const attachmentList = attachments.map((attachment) => ({
      name: attachment.name,
      size: formatFileSize(Number(attachment.size)),
      attached: attachedIds.has(attachment.id),
    }));

    return { emailAttachments, attachmentList };
  }
}
