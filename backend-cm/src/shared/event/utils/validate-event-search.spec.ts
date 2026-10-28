import { Role } from "../../../enum/role.enum";
import { validateEventSearch } from "./validate-event-search";

describe("validateEventSearch", () => {
  it("lets a user with a core role search without a target", () => {
    expect(() => validateEventSearch([Role.COS], undefined)).not.toThrow();
  });

  it("lets a party access user search the events of a target", () => {
    expect(() => validateEventSearch([Role.FCBC, Role.PARTY_ACCESS], "party-guid")).not.toThrow();
  });

  it("rejects a party access user searching without a target", () => {
    expect(() => validateEventSearch([Role.FCBC, Role.PARTY_ACCESS], undefined)).toThrow(
      "You can only search the events of a party.",
    );
  });
});
