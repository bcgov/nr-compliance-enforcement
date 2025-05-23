export interface GenerateReferralEmailParams {
  complaintId: string;
  complaintTypeDescription: string;
  senderName: string;
  senderEmailAddress: string;
  referredToAgency: string;
  referredByAgency: string;
  reasonForReferral: string;
  supportEmail: string;
  complaintSummaryText: string;
  complaintUrl: string;
}

export function generateReferralEmailBody(emailReferralParams: GenerateReferralEmailParams) {
  const {
    complaintId,
    complaintTypeDescription,
    senderName,
    senderEmailAddress,
    referredToAgency,
    referredByAgency,
    reasonForReferral,
    supportEmail,
    complaintSummaryText,
    complaintUrl,
  } = emailReferralParams;
  return `<p>Hello,</p>
<p>
  ${complaintTypeDescription} complaint #<a href=${complaintUrl}>${complaintId}</a> has been referred to ${referredToAgency} by <strong>${senderName} (CC’d)</strong> at ${referredByAgency}.
</p>
<ul>
  <li>Summary: ${complaintSummaryText}</li>
  <li>The reason for referral is: ${reasonForReferral}</li>
</ul>
<p>You can access the complaint and view any actions taken by the referring agency via:</p>
<ul>
  <li>The link above</li>
  <li>The complaint has been added to your list view in NatCom</li>
  <li>You may also view the attached PDF</li>
</ul>
<p>Please note this is an automated email from NatCom generated on behalf of the person sending the referral. If you need assistance, please contact:</p>
<ul>
  <li>${senderEmailAddress} for information about the complaint and referral.</li>
  <li>${supportEmail} for technical support.</li>
</ul>
`;
}
