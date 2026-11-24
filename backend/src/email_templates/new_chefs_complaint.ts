export interface NewComplaintEmailDetail {
  label: string;
  value: string;
}

export interface GenerateNewComplaintEmailParams {
  complaintId: string;
  complaintTypeDescription: string;
  complaintUrl?: string;
  details: NewComplaintEmailDetail[];
  supportEmail?: string;
}

// Submitted values come from the public, so escape them before putting them in the HTML body.
export const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatValue = (value: string): string => escapeHtml(value).replaceAll(/\r?\n/g, "<br>");

// Placeholder template for the business notification sent when a complaint arrives from CHEFS.
// The formal templates will replace this later.
export function generateNewComplaintEmailBody(params: GenerateNewComplaintEmailParams): string {
  const { complaintId, complaintTypeDescription, complaintUrl, details, supportEmail } = params;

  const complaintReference = complaintUrl
    ? `<a href="${escapeHtml(complaintUrl)}">#${escapeHtml(complaintId)}</a>`
    : `#${escapeHtml(complaintId)}`;

  const detailRows = details
    .map(
      ({ label, value }) =>
        `  <tr>
    <th style="text-align: left; vertical-align: top; padding: 4px 16px 4px 0;">${escapeHtml(label)}</th>
    <td style="vertical-align: top; padding: 4px 0;">${formatValue(value)}</td>
  </tr>`,
    )
    .join("\n");

  return `<p>Dear officer,</p>
<p>A new ${escapeHtml(
    complaintTypeDescription,
  )} complaint ${complaintReference} has been submitted through the online complaint form and added to NatSuite.</p>
<table style="border-collapse: collapse;">
${detailRows}
</table>
${complaintUrl ? `<p>You can view and manage the complaint in NatSuite using the link above.</p>` : ""}
<p>Please note this is an automated email from NatSuite.${
    supportEmail ? ` If you need technical support, please contact ${escapeHtml(supportEmail)}.` : ""
  }</p>
`;
}
