export interface GenerateInvestigationCollaboratorEmailParams {
  name: string;
  collaboratorName: string;
  owningAgency: string;
  senderName: string;
  senderEmailAddress: string;
  supportEmail: string;
  investigationUrl: string;
}

export function generateInvestigationCollaboratorEmailBody(
  emailCollaboratorParams: GenerateInvestigationCollaboratorEmailParams,
) {
  const { name, collaboratorName, owningAgency, senderName, senderEmailAddress, supportEmail, investigationUrl } =
    emailCollaboratorParams;
  return `<p>Hello ${collaboratorName},</p>
<p>
  You have been invited to collaborate on:
  <ul>
    <li>Investigation <strong><a href=${investigationUrl}>#${name}</a></strong></li>
    <li>Invitation from: <strong>${senderName} (CC'd)</strong> within ${owningAgency}</li>
  </ul>
</p>
<p>As a collaborator, you can:
  <ul>
    <li>Access the investigation via the link above.</li>
    <li>View the investigation to see changes over time.</li>
  </ul>
</p>
<p><strong><u>PLEASE DO NOT DELETE THIS EMAIL AS THE INVESTIGATION WILL NOT APPEAR IN YOUR LIST VIEW IN NATSUITE. You need to use the link above to open the investigation.</u></strong></p>
<p>Please note this is an automated email from NatSuite generated on behalf of the person inviting you to collaborate. If you need assistance, please contact:
  <ul>
    <li>${senderEmailAddress} for information about the investigation and collaboration efforts.</li>
    <li>${supportEmail} for technical support.</li>
  </ul>
</p>
`;
}
