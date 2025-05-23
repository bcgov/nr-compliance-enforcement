export interface GenerateCollaboratorEmailParams {
  complaintId: string;
  collaboratorName: string;
  complaintTypeDescription: string;
  owningAgency: string;
  senderName: string;
  senderEmailAddress: string;
  supportEmail: string;
  complaintSummaryText: string;
  complaintUrl: string;
}

export function generateCollaboratorEmailBody(emailCollaboratorParams: GenerateCollaboratorEmailParams) {
  const {
    complaintId,
    collaboratorName,
    complaintTypeDescription,
    owningAgency,
    senderName,
    senderEmailAddress,
    supportEmail,
    complaintSummaryText,
    complaintUrl,
  } = emailCollaboratorParams;
  return `<p>Hello ${collaboratorName},</p>
<p>
  You have been invited to collaborate on:
  <ul>
    <li>${complaintTypeDescription} complaint <strong><a href=${complaintUrl}>#${complaintId}</a></strong>, ${complaintSummaryText}</li>
    <li>Invitation from: <strong>${senderName} (CC'd)</strong> within ${owningAgency}</li>
  </ul>
</p>
<p>As a collaborator, you can:
  <ul>
    <li>Access the complaint via the link above.</li>
    <li>View the complaint to see changes over time.</li>
    <li><strong>Add your own contextual information in the <u>‘Additional notes’</u> section, <u>all other sections are read only.</u></strong>
      <ul>
        <li><em>Please note, adding ‘Additional notes’ is currently reserved for HWC and GIR complaints, you cannot add additional notes to shared Enforcement complaints at this time.</em></li>
      </ul>
    </li>
  </ul>
</p>
<p><strong><u>PLEASE DO NOT DELETE THIS EMAIL AS THE COMPLAINT WILL NOT APPEAR IN YOUR LIST VIEW IN NATCOM. You need to use the link above to open the complaint.</u></strong></p>
<p>Please note this is an automated email from NatCom generated on behalf of the person inviting you to collaborate. If you need assistance, please contact:
  <ul>
    <li>${senderEmailAddress} for information about the complaint and collaboration efforts.</li>
    <li>${supportEmail} for technical support.</li>
  </ul>
</p>
`;
}
