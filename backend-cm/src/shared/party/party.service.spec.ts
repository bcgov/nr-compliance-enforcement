import { PartyService } from "./party.service";
import { PartyMatchInput } from "./dto/party";
import { PARTY_TYPES } from "../../common/party";
import { BusinessIdentifiers } from "../../enum/business-identifier.enum";
import { ContactMethods } from "../../enum/contact-method.enum";

const makePartyService = (prisma: any = {}, mapper: any = {}): any =>
  new PartyService({} as any, {} as any, prisma, mapper, {} as any, {} as any);

const personInput = (input: Partial<PartyMatchInput> = {}): PartyMatchInput => ({
  partyTypeCode: PARTY_TYPES.Person,
  ...input,
});

const businessInput = (input: Partial<PartyMatchInput> = {}): PartyMatchInput => ({
  partyTypeCode: PARTY_TYPES.Company,
  ...input,
});

const personParty = (person: any = {}, party: any = {}): any => ({
  party_guid: "party-1",
  party_type: PARTY_TYPES.Person,
  person: { first_name: "Jon", last_name: "OBrien", ...person },
  ...party,
});

const businessParty = (business: any = {}, party: any = {}): any => ({
  party_guid: "party-1",
  party_type: PARTY_TYPES.Company,
  business: { name: "ABC Contracting Ltd", ...business },
  ...party,
});

const lookupNames = (service: any, input: PartyMatchInput): string[] =>
  service._buildMatchLookups(input).map((lookup: { name: string }) => lookup.name);

const lookupNamed = (service: any, input: PartyMatchInput, name: string): any =>
  service._buildMatchLookups(input).find((lookup: { name: string }) => lookup.name === name);

describe("_scoreMatch person fields", () => {
  const service = makePartyService();

  it("scores a drivers licence on its own at the highest tier", () => {
    const input = personInput({ person: { driversLicenseNumber: "1234-5678" } });
    const party = personParty({ drivers_license_number: "12345678" });

    expect(service._scoreMatch(input, party, {}).score).toBe(1000);
  });

  it("pays an exact name pair its fields plus the pair bonus", () => {
    const input = personInput({ person: { firstName: "Jon", lastName: "OBrien" } });
    const comparisons = { first_norm_eq: true, last_norm_eq: true };

    const { score, matchedFields } = service._scoreMatch(input, personParty(), comparisons);

    expect(score).toBe(200);
    expect(matchedFields).toContainEqual({ field: "firstName+lastName", exact: true, points: 100 });
  });

  it("absorbs the pair bonus into the name and date of birth bonus", () => {
    const input = personInput({
      person: { firstName: "Jon", lastName: "OBrien", dateOfBirth: new Date("1985-03-12T00:00:00.000Z") },
    });
    const party = personParty({ date_of_birth: new Date("1985-03-12T00:00:00.000Z") });
    const comparisons = { first_norm_eq: true, last_norm_eq: true };

    const { score, matchedFields } = service._scoreMatch(input, party, comparisons);

    expect(score).toBe(1000);
    expect(matchedFields.map((matched: any) => matched.field)).toContain("firstName+lastName+dateOfBirth");
    expect(matchedFields.map((matched: any) => matched.field)).not.toContain("firstName+lastName");
  });

  it("denies a combination when one of its fields only matched fuzzily", () => {
    const input = personInput({ person: { firstName: "Jon", lastName: "OBrien" } });
    const comparisons = { first_dmeta_eq: true, last_norm_eq: true };

    const { score, matchedFields } = service._scoreMatch(input, personParty(), comparisons);

    expect(score).toBe(75);
    expect(matchedFields).toContainEqual({ field: "firstName", exact: false, points: 25 });
    expect(matchedFields.every((matched: any) => !matched.field.includes("+"))).toBe(true);
  });

  it("applies the fuzzy modifier to a similar name and never both limbs", () => {
    const input = personInput({ person: { firstName: "Jon" } });

    expect(service._scoreMatch(input, personParty(), { first_sim: 0.45 }).score).toBe(25);
    expect(service._scoreMatch(input, personParty(), { first_sim: 0.45, first_dmeta_eq: true }).score).toBe(25);
    expect(service._scoreMatch(input, personParty(), { first_sim: 0.2 }).score).toBe(0);
  });

  it("holds an alias to its stricter similarity threshold", () => {
    const input = personInput({ person: { firstName: "James", lastName: "Muno" } });

    expect(service._scoreMatch(input, personParty(), { alias_sim: 0.35 }).score).toBe(0);
    expect(service._scoreMatch(input, personParty(), { alias_sim: 0.5 }).matchedFields).toEqual([
      { field: "alias", exact: false, points: 13 },
    ]);
  });

  it("pays the fuzzy share when one name is a prefix of the other", () => {
    const input = personInput({ person: { firstName: "Kat" } });

    expect(service._scoreMatch(input, personParty(), { first_prefix_eq: true }).score).toBe(25);
    expect(service._scoreMatch(input, personParty(), { first_norm_eq: true, first_prefix_eq: true }).score).toBe(50);
  });

  it("scores an alias as its own field alongside the name fields", () => {
    const input = personInput({ person: { firstName: "Jon", lastName: "OBrien" } });

    const aliasOnly = service._scoreMatch(input, personParty(), { alias_norm_eq: true });
    expect(aliasOnly.score).toBe(50);
    expect(aliasOnly.matchedFields).toEqual([{ field: "alias", exact: true, points: 50 }]);

    // first + last + alias + the first-last pair bonus
    const withNames = service._scoreMatch(input, personParty(), {
      alias_norm_eq: true,
      first_norm_eq: true,
      last_norm_eq: true,
    });
    expect(withNames.score).toBe(250);
    expect(withNames.matchedFields.map((matched: any) => matched.field)).toContain("alias");
  });

  it("compares the date of birth as a UTC calendar date", () => {
    const input = personInput({ person: { dateOfBirth: new Date("1985-03-12T00:00:00.000Z") } });

    expect(
      service._scoreMatch(input, personParty({ date_of_birth: new Date("1985-03-12T00:00:00.000Z") }), {}).score,
    ).toBe(50);
    expect(
      service._scoreMatch(input, personParty({ date_of_birth: new Date("1984-03-12T00:00:00.000Z") }), {}).score,
    ).toBe(0);
  });

  it("pays the fuzzy share for a close date of birth and keeps combinations exact", () => {
    const input = personInput({
      person: { firstName: "Jon", lastName: "OBrien", dateOfBirth: new Date("1985-03-12T00:00:00.000Z") },
    });
    const comparisons = { first_norm_eq: true, last_norm_eq: true };

    const transposed = service._scoreMatch(
      input,
      personParty({ date_of_birth: new Date("1985-12-03T00:00:00.000Z") }),
      comparisons,
    );
    expect(transposed.matchedFields).toContainEqual({ field: "dateOfBirth", exact: false, points: 25 });
    expect(transposed.matchedFields.map((matched: any) => matched.field)).not.toContain(
      "firstName+lastName+dateOfBirth",
    );

    const sameMonth = service._scoreMatch(
      input,
      personParty({ date_of_birth: new Date("1985-03-25T00:00:00.000Z") }),
      {},
    );
    expect(sameMonth.matchedFields).toContainEqual({ field: "dateOfBirth", exact: false, points: 25 });

    const sameYearOnly = service._scoreMatch(
      input,
      personParty({ date_of_birth: new Date("1985-06-20T00:00:00.000Z") }),
      {},
    );
    expect(sameYearOnly.matchedFields.map((matched: any) => matched.field)).not.toContain("dateOfBirth");
  });

  it("pays the fuzzy share for a name found in the other name slot", () => {
    const input = personInput({ person: { firstName: "James", middleNames: "Robert" } });

    const crossed = service._scoreMatch(input, personParty(), { first_middle_eq: true, middle_first_eq: true });
    expect(crossed.matchedFields).toContainEqual({ field: "firstName", exact: false, points: 13 });
    expect(crossed.matchedFields).toContainEqual({ field: "middleNames", exact: false, points: 13 });

    const alreadyExact = service._scoreMatch(input, personParty(), { first_norm_eq: true, first_middle_eq: true });
    expect(alreadyExact.matchedFields).toContainEqual({ field: "firstName", exact: true, points: 50 });
    expect(alreadyExact.matchedFields.filter((matched: any) => matched.field === "firstName")).toHaveLength(1);
  });

  it("pays the fuzzy share for half of a compound surname", () => {
    const input = personInput({ person: { lastName: "Roy" } });

    expect(service._scoreMatch(input, personParty(), { last_part_eq: true }).score).toBe(25);
  });

  it("does not double-count a young person derived from a matched approximate age", () => {
    const input = personInput({ person: { approximateAgeCode: "18UNDER" } });
    const party = personParty({ approximate_age_code: "18UNDER" });

    const { matchedFields } = service._scoreMatch(input, party, {});
    expect(matchedFields).toContainEqual({ field: "approximateAgeCode", exact: true, points: 10 });
    expect(matchedFields.map((matched: any) => matched.field)).not.toContain("youngPerson");
  });

  it("compares phones on their trailing ten digits whatever format was entered", () => {
    const input = personInput({
      contactMethods: [{ typeCode: ContactMethods.PHONE, value: "(250) 555-1234" }],
    });
    const party = personParty(
      {},
      { contact_method: [{ contact_method_type: "PHONE", contact_value: "+12505551234" }] },
    );

    expect(service._scoreMatch(input, party, {}).score).toBe(50);
  });

  it("sums awards across entered values but never across duplicates of one", () => {
    const party = personParty(
      {},
      {
        contact_method: [
          { contact_method_type: "PHONE", contact_value: "+12505551234" },
          { contact_method_type: "PHONE", contact_value: "250-555-1234" },
          { contact_method_type: "PHONE", contact_value: "+12505559999" },
        ],
      },
    );

    const twoValues = personInput({
      contactMethods: [
        { typeCode: ContactMethods.PHONE, value: "2505551234" },
        { typeCode: ContactMethods.PHONE, value: "2505559999" },
      ],
    });
    expect(service._scoreMatch(twoValues, party, {}).score).toBe(100);

    const oneValueTwice = personInput({
      contactMethods: [
        { typeCode: ContactMethods.PHONE, value: "(250) 555-1234" },
        { typeCode: ContactMethods.PHONE, value: "+12505551234" },
      ],
    });
    expect(service._scoreMatch(oneValueTwice, party, {}).score).toBe(50);
  });

  it("matches an email on its lowercased value", () => {
    const input = personInput({ contactMethods: [{ typeCode: ContactMethods.EMAIL, value: "Jon@Example.CA" }] });
    const party = personParty(
      {},
      { contact_method: [{ contact_method_type: "EMAILADDR", contact_value: "jon@example.ca" }] },
    );

    expect(service._scoreMatch(input, party, {}).score).toBe(50);
  });

  it("scores the address fields Postgres folded and the ones it compares itself", () => {
    const input = personInput({
      addresses: [{ address: "1 Main St", city: "Victoria", postalCode: "V8W 1A1", province: "BC", country: "CA" }],
    });
    const party = personParty(
      {},
      { address: [{ postal_code: "v8w1a1", country_subdivision_code: "BC", country_code: "CA" }] },
    );
    const comparisons = { address_norm_eq_0: true, city_norm_eq_0: true };

    const { score, matchedFields } = service._scoreMatch(input, party, comparisons);

    expect(score).toBe(170);
    expect(matchedFields.map((matched: any) => matched.field)).toEqual(
      expect.arrayContaining(["addressLine", "city", "postalCode", "province", "country"]),
    );
  });

  it("scores descriptor codes and measurements at the lowest tier", () => {
    const input = personInput({ person: { sexCode: "M", buildCode: "MED", heightInCm: 177.8, weightInKg: 80.5 } });
    const party = personParty({ sex_code: "M", build_code: "MED", height_cm: 177.8, weight_kg: 80.5 });

    expect(service._scoreMatch(input, party, {}).score).toBe(40);
    expect(service._scoreMatch(input, personParty({ sex_code: "M", height_cm: 180 }), {}).score).toBe(10);
  });

  it("scores the descriptor indicators only when both sides are true", () => {
    const input = personInput({ person: { facialHairIndicator: true, tattooIndicator: true } });

    expect(service._scoreMatch(input, personParty({ facial_hair_ind: true, tattoo_ind: true }), {}).score).toBe(20);
    expect(service._scoreMatch(input, personParty({ facial_hair_ind: false, tattoo_ind: false }), {}).score).toBe(0);

    const neitherEntered = personInput({ person: { facialHairIndicator: false } });
    expect(service._scoreMatch(neitherEntered, personParty({ facial_hair_ind: false }), {}).score).toBe(0);
  });

  it("does not let a young person derived from the date of birth score it twice", () => {
    const young = new Date("2015-01-01T00:00:00.000Z");
    const sameDate = personInput({ person: { dateOfBirth: young } });
    const otherDate = personInput({ person: { dateOfBirth: young } });

    expect(service._scoreMatch(sameDate, personParty({ date_of_birth: young }), {}).score).toBe(50);
    expect(
      service._scoreMatch(otherDate, personParty({ date_of_birth: new Date("2016-06-01T00:00:00.000Z") }), {}).score,
    ).toBe(10);
  });

  it("does not score gender", () => {
    const input = personInput({ person: { genderCode: "M" } });

    expect(service._scoreMatch(input, personParty({ gender_code: "M" }), {}).score).toBe(0);
  });
});

describe("_scoreMatch business fields", () => {
  const service = makePartyService();

  it("scores a business identifier on its own at the highest tier and stacks the two codes", () => {
    const businessNumberOnly = businessInput({
      business: {
        businessIdentifiers: [{ identifierCode: BusinessIdentifiers.BUSINESS_NUMBER, identifierValue: "123456789" }],
      },
    });
    const party = businessParty({
      business_identifier: [
        { business_identifier_code: "BNUM", identifier_value: "123456789" },
        { business_identifier_code: "WSBC", identifier_value: "987654321" },
      ],
    });

    expect(service._scoreMatch(businessNumberOnly, party, {}).score).toBe(1000);

    const bothCodes = businessInput({
      business: {
        businessIdentifiers: [
          { identifierCode: BusinessIdentifiers.BUSINESS_NUMBER, identifierValue: "123456789" },
          { identifierCode: BusinessIdentifiers.WSBC_NUMBER, identifierValue: "987654321" },
        ],
      },
    });
    expect(service._scoreMatch(bothCodes, party, {}).score).toBe(2000);
  });

  it("reduces a legal name's fuzzy modifier to a quarter", () => {
    const input = businessInput({ business: { name: "ABC Consulting Ltd" } });

    expect(service._scoreMatch(input, businessParty(), { business_name_norm_eq: true }).score).toBe(1000);
    expect(service._scoreMatch(input, businessParty(), { business_name_sim: 0.56 }).score).toBe(250);
  });

  it("awards a phone reaching a contact person at the contact tier, not the business tier", () => {
    const input = businessInput({ contactMethods: [{ typeCode: ContactMethods.PHONE, value: "250 555 1234" }] });
    const contactMethod = { contact_method_type: "PHONE", contact_value: "+12505551234" };

    const throughContact = businessParty(
      { business_person_xref: [{ person: { party: { contact_method: [contactMethod] } } }] },
      { contact_method: [contactMethod] },
    );
    expect(service._scoreMatch(input, throughContact, {}).score).toBe(1000);

    const businessOwnRow = businessParty({}, { contact_method: [contactMethod] });
    expect(service._scoreMatch(input, businessOwnRow, {}).score).toBe(50);
  });

  it("scores a contact person's name at the medium tier with a sounds-like limb", () => {
    const input = businessInput({ business: { contactPeople: [{ firstName: "Stephen", lastName: "Smith" }] } });

    const { score, matchedFields } = service._scoreMatch(input, businessParty(), {
      contact_first_dmeta_eq: true,
      contact_last_norm_eq: true,
    });

    expect(score).toBe(75);
    expect(matchedFields).toContainEqual({ field: "contactFirstName", exact: false, points: 25 });
  });

  it("does not score a postal code for a business", () => {
    const input = businessInput({ addresses: [{ postalCode: "V8W 1A1", province: "BC" }] });
    const party = businessParty({}, { address: [{ postal_code: "V8W1A1", country_subdivision_code: "BC" }] });

    expect(service._scoreMatch(input, party, {}).score).toBe(10);
  });
});

describe("_buildMatchLookups", () => {
  const service = makePartyService();

  it("emits nothing when no entered field narrows the party table", () => {
    expect(lookupNames(service, personInput({ person: { genderCode: "M" } }))).toEqual([]);
  });

  it("emits one lookup per entered person field", () => {
    const input = personInput({
      person: { firstName: "Jon", lastName: "OBrien", dateOfBirth: new Date("1985-03-12T00:00:00.000Z") },
      contactMethods: [{ typeCode: ContactMethods.PHONE, value: "250 555 1234" }],
    });

    expect(lookupNames(service, input)).toEqual([
      "firstLastName",
      "lastNameDateOfBirth",
      "lastName",
      "lastNameSoundsLike",
      "firstName",
      "firstNameSoundsLike",
      "personNameSimilar",
      "dateOfBirth",
      "dateOfBirthSwapped",
      "dateOfBirthMonth",
      "aliasName",
      "aliasNameSimilar",
      "phone",
    ]);
  });

  it("emits the transposed date lookup only when the day can be a month", () => {
    const canSwap = personInput({ person: { dateOfBirth: new Date("1985-03-12T00:00:00.000Z") } });
    const cannotSwap = personInput({ person: { dateOfBirth: new Date("1985-03-25T00:00:00.000Z") } });

    expect(lookupNames(service, canSwap)).toContain("dateOfBirthSwapped");
    expect(lookupNames(service, cannotSwap)).not.toContain("dateOfBirthSwapped");
  });

  it("emits one lookup per entered business field", () => {
    const input = businessInput({
      business: {
        name: "ABC Contracting Ltd",
        businessIdentifiers: [{ identifierCode: BusinessIdentifiers.WSBC_NUMBER, identifierValue: "987654321" }],
        contactPeople: [{ firstName: "Stephen", lastName: "Smith" }],
      },
      contactMethods: [{ typeCode: ContactMethods.EMAIL, value: "info@abc.ca" }],
    });

    expect(lookupNames(service, input)).toEqual([
      "worksafeBCNumber",
      "businessName",
      "businessNameSimilar",
      "contactFirstName",
      "contactLastName",
      "contactNameSimilar",
      "contactEmail",
      "email",
    ]);
  });

  it("binds a date of birth as a yyyy-mm-dd string cast to date", () => {
    const input = personInput({ person: { dateOfBirth: new Date("1985-03-12T00:00:00.000Z") } });
    const lookup = lookupNamed(service, input, "dateOfBirth");

    expect(lookup.sql.text).toContain("::date");
    expect(lookup.sql.values).toContain("1985-03-12");
  });

  it("carries the email contact method type code, which is not EMAIL, as the partial index literal", () => {
    const input = personInput({ contactMethods: [{ typeCode: ContactMethods.EMAIL, value: "jon@example.ca" }] });
    const lookup = lookupNamed(service, input, "email");

    expect(lookup.sql.text).toContain("cm.contact_method_type = 'EMAILADDR'");
    expect(lookup.sql.text).toContain("lower(cm.contact_value) = lower(");
    expect(
      lookupNamed(
        service,
        personInput({ contactMethods: [{ typeCode: ContactMethods.PHONE, value: "2505551234" }] }),
        "phone",
      ).sql.text,
    ).toContain("cm.contact_method_type = 'PHONE'");
  });

  it("skips the trigram lookups for a name too short to make trigrams", () => {
    const input = personInput({ person: { firstName: "Li" } });

    expect(lookupNames(service, input)).toEqual(["firstName", "firstNameSoundsLike", "aliasName"]);
  });

  it("joins party inside every lookup so contact parties cannot fill it", () => {
    const input = personInput({
      person: { firstName: "Jon", lastName: "OBrien" },
      addresses: [{ address: "1 Main St", postalCode: "V8W 1A1" }],
    });

    for (const lookup of service._buildMatchLookups(input)) {
      expect(lookup.sql.text).toContain("JOIN shared.party p ON p.party_guid");
      expect(lookup.sql.text).toContain("p.party_type =");
      expect(lookup.sql.text).toMatch(/LIMIT \d+/);
    }
  });

  it("qualifies every contrib call and filters the similar lookups by trigram similarity", () => {
    const input = personInput({ person: { firstName: "Frederic", lastName: "OBrien" } });
    const similar = lookupNamed(service, input, "personNameSimilar");

    expect(similar.sql.text).toContain("OPERATOR(public.%)");
    expect(similar.sql.text).not.toContain("OPERATOR(public.<->)");
    expect(lookupNamed(service, input, "firstNameSoundsLike").sql.text).toContain("public.dmetaphone");
  });
});

describe("_buildMatchComparisons", () => {
  const service = makePartyService();

  it("selects only the comparisons the entered fields can fill", () => {
    const input = personInput({
      person: { firstName: "Jon", middleNames: "Peter" },
      addresses: [{ address: "1 Main St", city: "Victoria" }],
    });
    const { text } = service._buildMatchComparisons(input);

    expect(text).toContain("AS first_norm_eq");
    expect(text).toContain("AS first_sim");
    expect(text).toContain("AS first_dmeta_eq");
    expect(text).toContain("AS middle_norm_eq");
    expect(text).toContain("AS middle_sim");
    expect(text).toContain("AS alias_norm_eq");
    expect(text).toContain("AS address_norm_eq_0");
    expect(text).toContain("AS city_norm_eq_0");
    expect(text).not.toContain("AS last_norm_eq");
    // Sounds-like is meaningless on a multi-word field, so middle names get no such limb
    expect(text).not.toContain("AS middle_dmeta_eq");
  });

  it("compares a business against its own name and its contact people", () => {
    const input = businessInput({
      business: { name: "ABC Contracting Ltd", contactPeople: [{ firstName: "Stephen" }] },
    });
    const { text } = service._buildMatchComparisons(input);

    expect(text).toContain("AS business_name_norm_eq");
    expect(text).toContain("AS business_name_sim");
    expect(text).toContain("AS contact_first_dmeta_eq");
    expect(text).not.toContain("AS contact_last_norm_eq");
    expect(text).not.toContain("AS alias_norm_eq");
  });
});

describe("matchParty", () => {
  const comparisonRow = (party_guid: string, comparisons: any = {}) => ({ party_guid, ...comparisons });

  const makeMatch = (comparisonRows: any[], parties: any[]) => {
    const tx = { $queryRaw: jest.fn().mockResolvedValueOnce([]).mockResolvedValueOnce(comparisonRows) };
    const prisma = {
      $transaction: jest.fn((run: (tx: any) => Promise<unknown>) => run(tx)),
      party: { findMany: jest.fn().mockResolvedValue(parties) },
    };
    const mapper = { map: jest.fn((party: any) => ({ partyIdentifier: party.party_guid })) };
    return { service: makePartyService(prisma, mapper), prisma, tx };
  };

  it("returns nothing without querying when no lookup is emitted", async () => {
    const { service, prisma } = makeMatch([], []);

    await expect(service.matchParty(personInput({ person: { sexCode: "M" } }))).resolves.toEqual([]);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("sets the similarity threshold as a bound parameter before the candidate query", async () => {
    const { service, tx } = makeMatch([], []);

    await service.matchParty(personInput({ person: { firstName: "Jon", lastName: "OBrien" } }));

    expect(tx.$queryRaw.mock.calls[0][0].join("")).toContain("set_config('pg_trgm.similarity_threshold'");
    expect(tx.$queryRaw.mock.calls[0][1]).toBe("0.3");
    expect(tx.$queryRaw.mock.calls.at(-1)?.[0].text).toContain("WITH candidate AS");
  });

  it("returns the party, its score and the calculation behind it", async () => {
    const { service } = makeMatch(
      [comparisonRow("party-1", { first_norm_eq: true, last_norm_eq: true })],
      [personParty({}, { party_guid: "party-1" })],
    );

    const results = await service.matchParty(personInput({ person: { firstName: "Jon", lastName: "OBrien" } }));

    expect(results).toEqual([
      {
        party: { partyIdentifier: "party-1" },
        score: 200,
        matchedFields: [
          { field: "firstName", exact: true, points: 50 },
          { field: "lastName", exact: true, points: 50 },
          { field: "firstName+lastName", exact: true, points: 100 },
        ],
      },
    ]);
  });

  it("drops candidates below the display floor", async () => {
    const { service } = makeMatch(
      [comparisonRow("party-1"), comparisonRow("party-2", { last_norm_eq: true })],
      [
        personParty({ sex_code: "M" }, { party_guid: "party-1" }),
        personParty({ sex_code: "M" }, { party_guid: "party-2" }),
      ],
    );

    const results = await service.matchParty(
      personInput({ person: { lastName: "OBrien", sexCode: "M" }, contactMethods: [] }),
    );

    expect(results.map((result: any) => result.party.partyIdentifier)).toEqual(["party-2"]);
  });

  it("breaks ties on the most recently updated party, then on guid", async () => {
    const comparisons = { last_norm_eq: true };
    const { service } = makeMatch(
      [
        comparisonRow("party-a", comparisons),
        comparisonRow("party-b", comparisons),
        comparisonRow("party-c", comparisons),
      ],
      [
        personParty({}, { party_guid: "party-c", update_utc_timestamp: null }),
        personParty({}, { party_guid: "party-a", update_utc_timestamp: null }),
        personParty({}, { party_guid: "party-b", update_utc_timestamp: new Date("2026-01-01T00:00:00.000Z") }),
      ],
    );

    const results = await service.matchParty(personInput({ person: { lastName: "OBrien" } }));

    expect(results.map((result: any) => result.party.partyIdentifier)).toEqual(["party-b", "party-a", "party-c"]);
  });
});
