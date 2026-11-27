jest.mock("src/external_api/shared_data", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

import { get, post } from "src/external_api/shared_data";
import { getInvestigationPartyReportData, getPartyReportData } from "src/external_api/party/party_report_data";

const mockGet = get as jest.Mock;
const mockPost = post as jest.Mock;

const TOKEN = "token";
// Regina is UTC-6 all year, so the expected local dates and times don't depend on the tzdata version or the season
const TZ = "America/Regina";

// 2026-11-28 05:30 UTC is still 2026-11-27 in Regina, so dates that use the server time zone would be a day off
const NOW = new Date("2026-11-28T05:30:00Z");

const codeTables = {
  approximateAgeCodes: [{ approximateAgeCode: "19TO30", shortDescription: "19 to 30" }],
  countries: [{ countryCode: "CA", shortDescription: "Canada" }],
  countrySubdivisions: [{ countrySubdivisionCode: "BC", shortDescription: "British Columbia" }],
  partyExternalIdCodes: [{ partyExternalIdCode: "FIN", shortDescription: "FIN" }],
  complexionCodes: [{ complexionCode: "MED", shortDescription: "Medium" }],
  buildCodes: [{ buildCode: "MED", shortDescription: "Medium" }],
  hairColourCodes: [{ hairColourCode: "BRN", shortDescription: "Brown" }],
  hairLengthCodes: [{ hairLengthCode: "SHRT", shortDescription: "Short" }],
  eyeColourCodes: [{ eyeColourCode: "BLU", shortDescription: "Blue" }],
  facialHairStyleCodes: [
    { facialHairStyleCode: "BRD", shortDescription: "Beard" },
    { facialHairStyleCode: "MST", shortDescription: "Moustache" },
  ],
  partyAssociationRoles: [
    { partyAssociationRole: "SUBJECT", caseActivityTypeCode: "INVSTGTN", shortDescription: "Subject" },
    { partyAssociationRole: "WITNESS", caseActivityTypeCode: "INSPECTION", shortDescription: "Witness" },
  ],
  agencyCodes: [
    { agencyCode: "COS", shortDescription: "COS" },
    { agencyCode: "EPO", shortDescription: "CEEB" },
  ],
  enforcementActionCodes: [
    { enforcementActionCode: "TICKET", shortDescription: "Ticket" },
    { enforcementActionCode: "WARN", shortDescription: "Warning" },
  ],
  ticketOutcomeCodes: [{ ticketOutcomeCode: "PAID", shortDescription: "Paid" }],
};

const contactMethod = (typeCode: string, value: string, isPrimary: boolean) => ({ typeCode, value, isPrimary });

const person = {
  personGuid: "PERSON-GUID",
  firstName: "John",
  middleNames: "Paul",
  lastName: "Smith",
  dateOfBirth: "1980-11-27",
  approximateAgeCode: null,
  driversLicenseNumber: "1234567",
  driversLicenseClass: "5",
  driversLicenseCountryCode: "CA",
  driversLicenseCountrySubdivisionCode: "BC",
  sexCode: "M",
  heightInCm: 180,
  weightInKg: 82.5,
  complexionCode: "MED",
  buildCode: "MED",
  hairColourCode: "OTH",
  hairColourOther: "Grey streaks",
  hairLengthCode: "SHRT",
  additionalHairDescriptors: null,
  eyeColourCode: "BLU",
  eyeColourOther: null,
  facialHairIndicator: true,
  facialHairStyleCodes: [{ facialHairStyleCode: "BRD" }, { facialHairStyleCode: "MST" }],
  tattooIndicator: false,
  tattooDescription: null,
  additionalDescriptors: "Limps on left leg",
  comments: "Known to carry bear spray.",
  safetyConcernReason: "Aggressive when approached",
};

const personParty = {
  partyIdentifier: "PARTY-1",
  partyTypeCode: "PRS",
  aliases: [{ name: "Johnny" }, { name: "JP" }],
  externalIds: [{ externalIdCode: "FIN", externalIdValue: "F-123" }],
  contactMethods: [
    contactMethod("PHONE", "2505551234", false),
    contactMethod("EMAILADDR", "john@example.com", true),
    contactMethod("PHONE", "+12505559999", true),
    contactMethod("PHONE", "2505550000", false),
  ],
  addresses: [
    {
      addressName: "Work",
      address: "1 Main St",
      city: "Victoria",
      province: "BC",
      postalCode: "V8V 1A1",
      country: "CA",
      isPrimary: false,
      displayInInvestigation: false,
      contactMethods: [],
    },
    {
      addressName: "Home",
      address: "22 Oak Ave",
      city: "Nanaimo",
      province: "BC",
      postalCode: "V9R 2B2",
      country: "CA",
      isPrimary: true,
      displayInInvestigation: true,
      contactMethods: [contactMethod("PHONE", "2505552222", true)],
    },
  ],
  person,
  business: null,
};

const businessParty = {
  partyIdentifier: "PARTY-2",
  partyTypeCode: "CMP",
  aliases: [{ name: "Acme Outfitters" }],
  externalIds: [],
  contactMethods: [],
  addresses: [],
  person: null,
  business: {
    businessGuid: "BUSINESS-GUID",
    name: "Acme Ltd",
    safetyConcernReason: null,
    businessIdentifiers: [
      { identifierCode: "BNUM", identifierValue: "123456789" },
      { identifierCode: "WSBC", identifierValue: "" },
    ],
    contactPeople: [
      {
        title: "Manager",
        isPrimary: false,
        displayInInvestigation: false,
        person: { firstName: "Sam", lastName: "Lee" },
        contactMethods: [contactMethod("EMAILADDR", "sam@acme.example", true)],
        associatedAddresses: [],
      },
      {
        title: "Owner",
        isPrimary: true,
        displayInInvestigation: true,
        person: { firstName: "Pat", lastName: "Jones" },
        contactMethods: [contactMethod("PHONE", "2505553333", true)],
        associatedAddresses: [{ address: { addressName: "Head office" } }, { address: { addressName: "Yard" } }],
      },
    ],
  },
};

const emptyHistory = {
  partyHistoryInvestigations: [],
  partyHistoryInspections: [],
  partyHistoryCaseFiles: [],
  InvestigationParties: [],
  InspectionParties: [],
};

const history = {
  partyHistoryInvestigations: [
    {
      investigationGuid: "INV-ZETA",
      name: "Zeta poaching",
      leadAgency: "COS",
      openedTimestamp: "2026-03-02T05:30:00Z",
      investigationStatus: { shortDescription: "Closed" },
      primaryInvestigatorGuid: "USER-1",
      supervisorGuid: "USER-2",
      contraventions: [
        {
          legislationIdentifierRef: "LEG-REG",
          investigationParty: [
            {
              partyReference: "PARTY-1",
              enforcementActions: [
                { enforcementActionCode: { enforcementActionCode: "TICKET" }, ticket: { ticketOutcomeCode: "PAID" } },
                { enforcementActionCode: { enforcementActionCode: "WARN" }, ticket: null },
              ],
            },
            {
              partyReference: "SOMEONE-ELSE",
              enforcementActions: [{ enforcementActionCode: { enforcementActionCode: "WARN" }, ticket: null }],
            },
          ],
        },
        {
          legislationIdentifierRef: "LEG-ACT",
          investigationParty: [{ partyReference: "PARTY-1", enforcementActions: [] }],
        },
      ],
    },
    {
      investigationGuid: "INV-ALPHA",
      name: "Alpha dumping",
      leadAgency: "EPO",
      openedTimestamp: "2026-10-10T18:00:00Z",
      investigationStatus: { shortDescription: "Open" },
      primaryInvestigatorGuid: "USER-1",
      supervisorGuid: null,
      contraventions: [{ legislationIdentifierRef: "LEG-ACT", investigationParty: [] }],
    },
  ],
  partyHistoryInspections: [
    {
      inspectionGuid: "INSP-MID",
      name: "Mid inspection",
      leadAgency: "EPO",
      inspectionStatus: { shortDescription: "Closed" },
    },
  ],
  partyHistoryCaseFiles: [
    { activities: [{ activityIdentifier: "INV-ZETA" }, { activityIdentifier: "INSP-MID" }] },
    { activities: [{ activityIdentifier: "INV-ALPHA" }] },
  ],
  InvestigationParties: [
    { investigationGuid: "INV-ZETA", partyAssociationRole: "SUBJECT" },
    { investigationGuid: "INV-ALPHA", partyAssociationRole: "SUBJECT" },
  ],
  InspectionParties: [{ inspectionGuid: "INSP-MID", partyAssociationRole: "WITNESS" }],
};

const historyLookups = {
  appUsersByGuids: [
    { appUserGuid: "USER-1", firstName: "Ann", lastName: "Officer" },
    { appUserGuid: "USER-2", firstName: "Bob", lastName: "Boss" },
  ],
  legislation_0: {
    legislationTypeCode: "SEC",
    fullCitation: "s. 9(1)(a)",
    sectionTitle: "Hunting",
    ancestors: [
      { legislationTypeCode: "REG", sectionTitle: "Hunting Regulation" },
      { legislationTypeCode: "ACT", sectionTitle: "Wildlife Act" },
    ],
  },
  legislation_1: {
    legislationTypeCode: "SEC",
    fullCitation: "Wildlife Act, s. 33",
    sectionTitle: "Possession",
    ancestors: [{ legislationTypeCode: "ACT", sectionTitle: "Wildlife Act" }],
  },
};

// Answers each GraphQL GET by which query it is
const mockGetResponses = (responses: { party?: unknown; investigation?: unknown; history?: unknown }) => {
  mockGet.mockImplementation(async (_token: string, { query }: { query: string }) => {
    if (query.includes("partyHistoryInvestigations")) {
      return { data: responses.history ?? emptyHistory };
    }
    if (query.includes("getInvestigation(")) {
      return { data: { getInvestigation: responses.investigation, ...codeTables } };
    }
    return { data: { party: responses.party, ...codeTables } };
  });
};

const queriesSent = (mock: jest.Mock): string[] => mock.mock.calls.map(([, payload]) => payload.query);

describe("party report data", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: NOW });
    mockGet.mockReset();
    mockPost.mockReset();
    mockPost.mockResolvedValue({ response: { data: { data: historyLookups } }, error: null });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("getPartyReportData for a person", () => {
    it("builds the header and party details", async () => {
      mockGetResponses({ party: personParty });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);

      expect(report.partyName).toBe("SMITH, John Paul");
      expect(report.generatedOn).toBe("2026-11-27 at 23:30");
      expect(report.isPerson).toBe(true);
      expect(report.isBusiness).toBe(false);
      expect(report.investigationRole).toBe("");
      expect(report.safetyConcernReason).toBe("Aggressive when approached");
      expect(report.hasPartyDetails).toBe(true);
    });

    it("builds identifying information in screen order, leaving out empty values", async () => {
      mockGetResponses({ party: personParty });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);

      expect(report.identifyingInformation).toEqual([
        { label: "First name", value: "John" },
        { label: "Middle name(s)", value: "Paul" },
        { label: "Last name", value: "Smith" },
        { label: "Alias(es)", value: "Johnny, JP" },
        { label: "Sex as per ID", value: "M" },
        { label: "Date of birth", value: "1980-11-27" },
        // Birthday is today in the user's time zone, even though it is already tomorrow in UTC
        { label: "Age", value: "46 years old" },
        { label: "Driver's licence number", value: "1234567" },
        { label: "Driver's licence class", value: "5" },
        { label: "Driver's licence country", value: "Canada" },
        { label: "Driver's licence province", value: "British Columbia" },
        { label: "FIN", value: "F-123" },
      ]);
    });

    it("shows approximate age instead of age when there is no date of birth", async () => {
      mockGetResponses({
        party: { ...personParty, person: { ...person, dateOfBirth: null, approximateAgeCode: "19TO30" } },
      });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);
      const labels = report.identifyingInformation.map((row) => row.label);

      expect(labels).not.toContain("Date of birth");
      expect(labels).not.toContain("Age");
      expect(report.identifyingInformation).toContainEqual({ label: "Approximate age", value: "19 to 30" });
    });

    it("lists phones then email addresses, primary first, with positional labels", async () => {
      mockGetResponses({ party: personParty });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);

      expect(report.hasContactMethods).toBe(true);
      expect(report.contactMethods).toEqual([
        { label: "Primary phone", value: "(250) 555-9999" },
        { label: "Alternate phone", value: "(250) 555-1234" },
        { label: "Alternate phone 2", value: "(250) 555-0000" },
        { label: "Primary email address", value: "john@example.com" },
      ]);
    });

    it("lists addresses primary first, with descriptions in the address line", async () => {
      mockGetResponses({ party: personParty });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);

      expect(report.hasAddresses).toBe(true);
      expect(report.addresses).toEqual([
        {
          name: "Home (Primary)",
          address: "22 Oak Ave, Nanaimo, British Columbia, Canada, V9R 2B2",
          contactMethods: [{ label: "Primary phone", value: "(250) 555-2222" }],
        },
        {
          name: "Work",
          address: "1 Main St, Victoria, British Columbia, Canada, V8V 1A1",
          contactMethods: [],
        },
      ]);
    });

    it("builds descriptors in screen order, leaving out empty values", async () => {
      mockGetResponses({ party: personParty });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);

      expect(report.hasDescriptors).toBe(true);
      expect(report.descriptors).toEqual([
        { label: "Height", value: "180 cm (5 feet 11 inches)" },
        { label: "Weight", value: "82.5 kg (182 lbs)" },
        { label: "Complexion", value: "Medium" },
        { label: "Build", value: "Medium" },
        { label: "Hair colour", value: "Other (Grey streaks)" },
        { label: "Hair length", value: "Short" },
        { label: "Eye colour", value: "Blue" },
        { label: "Facial hair", value: "Yes" },
        { label: "Facial hair style", value: "Beard, Moustache" },
        // "No" is a value: only a missing indicator is left out
        { label: "Has tattoos", value: "No" },
        { label: "Additional descriptors", value: "Limps on left leg" },
      ]);
      expect(report.comments).toBe("Known to carry bear spray.");
    });

    it("flags empty sections so the template can hide them", async () => {
      const emptyPerson = { personGuid: "PERSON-GUID", firstName: "Jane", lastName: "Doe" };
      mockGetResponses({
        party: { ...personParty, aliases: [], externalIds: [], contactMethods: [], addresses: [], person: emptyPerson },
      });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);

      expect(report.hasPartyDetails).toBe(false);
      expect(report.hasContactMethods).toBe(false);
      expect(report.hasAddresses).toBe(false);
      expect(report.hasDescriptors).toBe(false);
      expect(report.hasHistory).toBe(false);
      expect(report.identifyingInformation).toEqual([
        { label: "First name", value: "Jane" },
        { label: "Last name", value: "Doe" },
      ]);
    });

    it("throws when the party is not found", async () => {
      mockGetResponses({ party: null });

      await expect(getPartyReportData(TOKEN, "MISSING", TZ)).rejects.toThrow("Party not found: MISSING");
    });

    it("throws when the party query returns GraphQL errors", async () => {
      mockGet.mockResolvedValue({ data: null, errors: [{ message: "boom" }] });

      await expect(getPartyReportData(TOKEN, "PARTY-1", TZ)).rejects.toThrow(
        "GraphQL errors occurred while fetching party",
      );
    });
  });

  describe("getPartyReportData for a business", () => {
    it("builds identifying information in screen order, leaving out empty values", async () => {
      mockGetResponses({ party: businessParty });

      const report = await getPartyReportData(TOKEN, "PARTY-2", TZ);

      expect(report.partyName).toBe("Acme Ltd");
      expect(report.isPerson).toBe(false);
      expect(report.isBusiness).toBe(true);
      expect(report.identifyingInformation).toEqual([
        { label: "Legal name", value: "Acme Ltd" },
        { label: "Business number", value: "123456789" },
        { label: "Doing business as", value: "Acme Outfitters" },
      ]);
    });

    it("lists contacts primary first, with their contact methods and offices", async () => {
      mockGetResponses({ party: businessParty });

      const report = await getPartyReportData(TOKEN, "PARTY-2", TZ);

      expect(report.hasContacts).toBe(true);
      expect(report.contacts).toEqual([
        {
          title: "Owner (Primary)",
          rows: [
            { label: "Name", value: "JONES, Pat" },
            { label: "Primary phone", value: "(250) 555-3333" },
            { label: "Offices associated with", value: "Head office, Yard" },
          ],
        },
        {
          title: "Manager",
          rows: [
            { label: "Name", value: "LEE, Sam" },
            { label: "Primary email address", value: "sam@acme.example" },
          ],
        },
      ]);
    });

    it("looks up history by the business guid", async () => {
      mockGetResponses({ party: businessParty });

      await getPartyReportData(TOKEN, "PARTY-2", TZ);

      const historyQuery = queriesSent(mockGet).find((query) => query.includes("partyHistoryInvestigations"));
      expect(historyQuery).toContain('partyId: "BUSINESS-GUID", partyType: "CMP"');
      expect(historyQuery).toContain('InvestigationParties(partyRefId: "PARTY-2")');
    });
  });

  describe("getInvestigationPartyReportData", () => {
    const investigationParty = {
      ...personParty,
      partyIdentifier: "INV-PARTY-1",
      partyReference: "PARTY-1",
      partyAssociationRole: "SUBJECT",
      person: { ...person, personGuid: undefined, personReference: "PERSON-GUID" },
    };

    it("exports the matching investigation party with its investigation role", async () => {
      mockGetResponses({
        investigation: { parties: [{ ...investigationParty, partyIdentifier: "OTHER" }, investigationParty] },
      });

      const report = await getInvestigationPartyReportData(TOKEN, "INV-1", "INV-PARTY-1", TZ);

      expect(report.partyName).toBe("SMITH, John Paul");
      expect(report.investigationRole).toBe("Subject");
    });

    it("only includes addresses and contacts flagged for display in the investigation", async () => {
      mockGetResponses({
        investigation: {
          parties: [
            investigationParty,
            { ...businessParty, partyIdentifier: "INV-PARTY-2", partyReference: "PARTY-2" },
          ],
        },
      });

      const personReport = await getInvestigationPartyReportData(TOKEN, "INV-1", "INV-PARTY-1", TZ);
      const businessReport = await getInvestigationPartyReportData(TOKEN, "INV-1", "INV-PARTY-2", TZ);

      expect(personReport.addresses.map((address) => address.name)).toEqual(["Home (Primary)"]);
      expect(businessReport.contacts.map((contact) => contact.title)).toEqual(["Owner (Primary)"]);
    });

    it("looks up history by the shared party it references", async () => {
      mockGetResponses({ investigation: { parties: [investigationParty] } });

      await getInvestigationPartyReportData(TOKEN, "INV-1", "INV-PARTY-1", TZ);

      const historyQuery = queriesSent(mockGet).find((query) => query.includes("partyHistoryInvestigations"));
      expect(historyQuery).toContain('partyId: "PERSON-GUID", partyType: "PRS"');
      expect(historyQuery).toContain('InvestigationParties(partyRefId: "PARTY-1")');
    });

    it("skips the history for an unpublished party", async () => {
      const unpublishedParty = { ...investigationParty, partyReference: null };
      mockGetResponses({ investigation: { parties: [unpublishedParty] } });

      const report = await getInvestigationPartyReportData(TOKEN, "INV-1", "INV-PARTY-1", TZ);

      expect(report.hasHistory).toBe(false);
      expect(report.history).toEqual([]);
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockPost).not.toHaveBeenCalled();
    });

    it("throws when the party is not in the investigation", async () => {
      mockGetResponses({ investigation: { parties: [investigationParty] } });

      await expect(getInvestigationPartyReportData(TOKEN, "INV-1", "MISSING", TZ)).rejects.toThrow(
        "Investigation party not found: MISSING",
      );
    });
  });

  describe("compliance and enforcement history", () => {
    it("builds one entry per activity, sorted by name", async () => {
      mockGetResponses({ party: personParty, history });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);

      expect(report.hasHistory).toBe(true);
      expect(report.history.map((entry) => entry.name)).toEqual(["Alpha dumping", "Mid inspection", "Zeta poaching"]);
    });

    it("fills in the investigation columns in the user's time zone", async () => {
      mockGetResponses({ party: personParty, history });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);
      const zeta = report.history.find((entry) => entry.name === "Zeta poaching");

      expect(zeta).toMatchObject({
        role: "Subject",
        // Opened 05:30 UTC on March 2, which is still March 1 in Regina
        dateOpened: "2026-03-01",
        agency: "COS",
        status: "Closed",
        primaryInvestigator: "Officer, Ann",
        supervisor: "Boss, Bob",
      });
    });

    it("lists this party's decisions under each contravention", async () => {
      mockGetResponses({ party: personParty, history });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);
      const zeta = report.history.find((entry) => entry.name === "Zeta poaching");

      expect(zeta.contraventions).toEqual([
        // A regulation's citation gets its act in front
        { label: "Contravention", value: "Wildlife Act, s. 9(1)(a)" },
        { label: "Decision", value: "Ticket (Paid)" },
        { label: "Contravention", value: "Wildlife Act, s. 9(1)(a)" },
        { label: "Decision", value: "Warning" },
        // No decision for this party: just the citation
        { label: "Contravention", value: "Wildlife Act, s. 33" },
      ]);
    });

    it("shows no contraventions for an open investigation", async () => {
      mockGetResponses({ party: personParty, history });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);
      const alpha = report.history.find((entry) => entry.name === "Alpha dumping");

      expect(alpha.contraventions).toEqual([]);
      expect(alpha.supervisor).toBe("-");
    });

    it("leaves the investigation-only columns empty for an inspection", async () => {
      mockGetResponses({ party: personParty, history });

      const report = await getPartyReportData(TOKEN, "PARTY-1", TZ);
      const inspection = report.history.find((entry) => entry.name === "Mid inspection");

      expect(inspection).toEqual({
        name: "Mid inspection",
        role: "Witness",
        dateOpened: "",
        agency: "CEEB",
        status: "Closed",
        primaryInvestigator: "",
        supervisor: "",
        contraventions: [],
      });
    });

    it("sends the officer and legislation lookups as a POST", async () => {
      mockGetResponses({ party: personParty, history });

      await getPartyReportData(TOKEN, "PARTY-1", TZ);

      expect(mockPost).toHaveBeenCalledTimes(1);
      const [lookupQuery] = queriesSent(mockPost);
      expect(lookupQuery).toContain('appUserGuids: ["USER-1", "USER-2"]');
      expect(lookupQuery).toContain('legislation_0: legislation(legislationGuid: "LEG-REG", includeAncestors: true)');
      expect(lookupQuery).toContain('legislation_1: legislation(legislationGuid: "LEG-ACT", includeAncestors: true)');
      expect(queriesSent(mockGet).some((query) => query.includes("legislation("))).toBe(false);
    });

    it("skips the lookups when no activity needs them", async () => {
      mockGetResponses({ party: personParty });

      await getPartyReportData(TOKEN, "PARTY-1", TZ);

      expect(mockPost).not.toHaveBeenCalled();
    });

    it("throws when the lookups return GraphQL errors", async () => {
      mockGetResponses({ party: personParty, history });
      mockPost.mockResolvedValue({ response: { data: { errors: [{ message: "boom" }] } }, error: null });

      await expect(getPartyReportData(TOKEN, "PARTY-1", TZ)).rejects.toThrow(
        "GraphQL errors occurred while fetching party history lookups",
      );
    });

    it("throws when the lookup request fails", async () => {
      mockGetResponses({ party: personParty, history });
      mockPost.mockResolvedValue({ response: null, error: { message: "Request failed with status code 431" } });

      await expect(getPartyReportData(TOKEN, "PARTY-1", TZ)).rejects.toThrow(
        "Request failed while fetching party history lookups: Request failed with status code 431",
      );
    });
  });
});
