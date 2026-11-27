import {
  buildContactRows,
  contactMethodFields,
  getPartyName,
  ReportContactMethod,
  ReportRow,
} from "src/external_api/party/party_data";

// Matches BUSINESS_IDENTIFIER_LABELS on the frontend
const BUSINESS_IDENTIFIER_LABELS: Record<string, string> = {
  BNUM: "Business number",
  WSBC: "Worksafe BC number",
};

interface ReportContactPerson {
  title?: string;
  isPrimary?: boolean;
  displayInInvestigation?: boolean;
  person?: { firstName?: string; lastName?: string } | null;
  contactMethods?: Array<ReportContactMethod | null>;
  associatedAddresses?: Array<{ address?: { addressName?: string } | null } | null>;
}

export interface ReportBusiness {
  businessGuid?: string;
  businessReference?: string;
  name?: string;
  safetyConcernReason?: string;
  businessIdentifiers?: Array<{ identifierCode?: string; identifierValue?: string } | null>;
  contactPeople?: Array<ReportContactPerson | null>;
}

// Business fields shared by the party and investigation party queries
export const businessReportFields = `
  name
  safetyConcernReason
  businessIdentifiers {
    identifierCode
    identifierValue
  }
  contactPeople {
    title
    isPrimary
    displayInInvestigation
    person {
      firstName
      lastName
    }
    ${contactMethodFields}
    associatedAddresses {
      address {
        addressName
      }
    }
  }
`;

// Business identifying information rows in screen order; empty values are left out
const buildBusinessIdentifyingInformation = (
  business: ReportBusiness,
  aliases: string,
  externalIds: ReportRow[],
): ReportRow[] =>
  [
    { label: "Legal name", value: business.name ?? "" },
    ...(business.businessIdentifiers ?? [])
      .filter((identifier): identifier is NonNullable<typeof identifier> => identifier != null)
      .map((identifier) => ({
        label: BUSINESS_IDENTIFIER_LABELS[identifier.identifierCode ?? ""] ?? identifier.identifierCode ?? "",
        value: identifier.identifierValue ?? "",
      })),
    { label: "Doing business as", value: aliases },
    ...externalIds,
  ].filter((row) => row.value);

// Matches BusinessContactPersonInformation on the frontend: investigation parties only show contacts flagged for
// display in the investigation; primary first
const buildContacts = (business: ReportBusiness, isInvestigationParty: boolean) =>
  (business.contactPeople ?? [])
    .filter((contact): contact is ReportContactPerson => contact != null)
    .filter((contact) => (isInvestigationParty ? contact.displayInInvestigation : true))
    .sort((a, b) => Number(b.isPrimary ?? false) - Number(a.isPrimary ?? false))
    .map((contact) => {
      const offices = (contact.associatedAddresses ?? [])
        .map((associatedAddress) => associatedAddress?.address?.addressName)
        .filter(Boolean)
        .join(", ");

      return {
        // Carbone formatters can't output parentheses, so the Primary badge text is added here
        title: contact.isPrimary ? `${contact.title ?? ""} (Primary)` : (contact.title ?? ""),
        rows: [
          {
            label: "Name",
            value: getPartyName({
              person: { firstName: contact.person?.firstName, lastName: contact.person?.lastName },
            }),
          },
          ...buildContactRows(contact.contactMethods),
          ...(offices ? [{ label: "Offices associated with", value: offices }] : []),
        ],
      };
    });

export const buildBusinessReport = (
  business: ReportBusiness,
  aliases: string,
  externalIds: ReportRow[],
  isInvestigationParty: boolean,
) => {
  const contacts = buildContacts(business, isInvestigationParty);
  return {
    identifyingInformation: buildBusinessIdentifyingInformation(business, aliases, externalIds),
    hasContacts: contacts.length > 0,
    contacts,
  };
};
