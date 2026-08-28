import { Test, TestingModule } from "@nestjs/testing";
import { PartyResolver } from "./party.resolver";
import { PartyService } from "./party.service";
import { PartyMatchResult } from "./dto/party";
import { PARTY_TYPES } from "../../common/party";

describe("PartyResolver", () => {
  const match: PartyMatchResult = {
    party: { partyIdentifier: "party-1" } as any,
    score: 200,
    matchedFields: [
      { field: "firstName", exact: true, points: 50 },
      { field: "lastName", exact: true, points: 50 },
      { field: "firstName+lastName", exact: true, points: 100 },
    ],
  };

  let resolver: PartyResolver;
  let partyService: { matchParty: jest.Mock };

  beforeEach(async () => {
    partyService = { matchParty: jest.fn().mockResolvedValue([match]) };
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartyResolver, { provide: PartyService, useValue: partyService }],
    }).compile();

    resolver = await module.resolve<PartyResolver>(PartyResolver);
  });

  it("returns each match as a party with its score and the calculation behind it", async () => {
    const input = { partyTypeCode: PARTY_TYPES.Person, person: { firstName: "Jon", lastName: "OBrien" } };

    const results = await resolver.matchParty(input);

    expect(partyService.matchParty).toHaveBeenCalledWith(input);
    expect(results).toEqual([match]);
    expect(Object.keys(results[0])).toEqual(["party", "score", "matchedFields"]);
    expect(Object.keys(results[0].matchedFields[0])).toEqual(["field", "exact", "points"]);
  });

  it("reports a failed match rather than returning no matches", async () => {
    partyService.matchParty.mockRejectedValue(new Error("boom"));

    await expect(resolver.matchParty({ partyTypeCode: PARTY_TYPES.Person })).rejects.toThrow(
      "Error matching parties from Shared schema",
    );
  });
});
