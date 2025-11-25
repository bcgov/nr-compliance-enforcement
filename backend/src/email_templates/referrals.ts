export interface GenerateReferralEmailParams {
  complaintId: string;
  complaintTypeDescription?: string;
  referringUserName: string;
  referringUserEmail: string;
  referredToAgency: string;
  referredByAgency: string;
  reasonForReferral: string;
  supportEmail: string;
  complaintSummaryText: string;
  complaintUrl?: string;
  isExternal: boolean;
}

export function generateReferralEmailBody(emailReferralParams: GenerateReferralEmailParams) {
  const {
    complaintId,
    complaintTypeDescription,
    referringUserName,
    referringUserEmail,
    referredToAgency,
    referredByAgency,
    reasonForReferral,
    supportEmail,
    complaintSummaryText,
    complaintUrl,
    isExternal,
  } = emailReferralParams;

  return `<p>Hello,</p>
<p>
  ${
    isExternal
      ? `Complaint #${complaintId}`
      : `${complaintTypeDescription} complaint #<a href=${complaintUrl}>${complaintId}</a>`
  }
  has been referred to ${referredToAgency} by <strong>${referringUserName} (CC'd)</strong> at ${referredByAgency}.
</p>
<ul>
  <li>Summary of complaint and location: ${complaintSummaryText}</li>
  <li>The reason for referral is: ${reasonForReferral}</li>
</ul>
${
  isExternal
    ? `<b>You can view the full complaint details and any actions taken in the <u>attached PDF</u>.</b>`
    : `<p>You can access the complaint and view any actions taken by the referring agency via:</p>
  <ul>
    <li>The link above</li>
    <li>The complaint has been added to your list view in NatCom</li>
    <li>You may also view the attached PDF</li>
  </ul>`
}
<p>Please note this is an automated email from ${
    isExternal ? `${referredByAgency}'s complaint management system` : `NatCom`
  } generated on behalf of the person sending the referral. If you need assistance, please contact:</p>
<ul>
  <li>${referringUserEmail} for information about the complaint and referral.</li>
  <li>${supportEmail} for technical support.</li>
</ul>
`;
}
