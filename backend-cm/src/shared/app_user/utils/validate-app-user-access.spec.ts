import { Role } from "../../../enum/role.enum";
import { AppUser } from "../dto/app_user";
import { validateAppUserAccess } from "./validate-app-user-access";

const USER_GUID = "ABCDEF0123456789ABCDEF0123456789";
const ownRecord = { authUserGuid: "abcdef01-2345-6789-abcd-ef0123456789" } as AppUser;
const otherRecord = { authUserGuid: "OTHERGUID" } as AppUser;

describe("validateAppUserAccess", () => {
  it("lets a user with a core role look up any user record", () => {
    expect(() => validateAppUserAccess([Role.COS], USER_GUID, otherRecord)).not.toThrow();
  });

  it("lets an admin without a core role look up any user record", () => {
    expect(() => validateAppUserAccess([Role.DFO, Role.GLOBAL_ADMINISTRATOR], USER_GUID, otherRecord)).not.toThrow();
  });

  it("lets a party access user look up their own record", () => {
    expect(() => validateAppUserAccess([Role.FCBC, Role.PARTY_ACCESS], USER_GUID, ownRecord)).not.toThrow();
  });

  it("lets a party access user look up a record that does not exist", () => {
    expect(() => validateAppUserAccess([Role.FCBC, Role.PARTY_ACCESS], USER_GUID, null)).not.toThrow();
  });

  it("rejects a party access user looking up another user's record", () => {
    expect(() => validateAppUserAccess([Role.FCBC, Role.PARTY_ACCESS], USER_GUID, otherRecord)).toThrow(
      "You can only view your own user record.",
    );
  });
});
