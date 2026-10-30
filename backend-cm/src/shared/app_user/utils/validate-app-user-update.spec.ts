import { Role } from "../../../enum/role.enum";
import { AppUser } from "../dto/app_user";
import { validateAppUserUpdate } from "./validate-app-user-update";

const USER_GUID = "ABCDEF0123456789ABCDEF0123456789";
const ownRecord = { authUserGuid: USER_GUID, userId: "JSMITH" } as AppUser;
const unlinkedRecord = { authUserGuid: null, userId: "JSMITH" } as AppUser;
const otherRecord = { authUserGuid: "OTHERGUID", userId: "OTHER" } as AppUser;

describe("validateAppUserUpdate", () => {
  it("lets an administrator update any user record", () => {
    expect(() =>
      validateAppUserUpdate([Role.AGENCY_ADMINISTRATOR], USER_GUID, "JSMITH", otherRecord, {
        deactivateIndicator: true,
      }),
    ).not.toThrow();
  });

  it("lets a user update the name, user ID and COMS enrolment on their own record", () => {
    expect(() =>
      validateAppUserUpdate([Role.PARTY_ACCESS], USER_GUID, "JSMITH", ownRecord, {
        userId: "JSMITH",
        firstName: "Jane",
        lastName: "Smith",
        comsEnrolledIndicator: true,
      }),
    ).not.toThrow();
  });

  it("lets a user link their auth user GUID to their unlinked record", () => {
    expect(() =>
      validateAppUserUpdate([Role.COS], USER_GUID, "JSMITH", unlinkedRecord, {
        authUserGuid: "abcdef01-2345-6789-abcd-ef0123456789",
      }),
    ).not.toThrow();
  });

  it("rejects an update to another user's record", () => {
    expect(() => validateAppUserUpdate([Role.COS], USER_GUID, "JSMITH", otherRecord, { firstName: "Jane" })).toThrow(
      "You can only update your own user record.",
    );
  });

  it("rejects a change to other details on their own record", () => {
    expect(() =>
      validateAppUserUpdate([Role.COS], USER_GUID, "JSMITH", ownRecord, { deactivateIndicator: true }),
    ).toThrow("Only an administrator can change these user details.");
  });

  it("rejects linking another auth user GUID", () => {
    expect(() =>
      validateAppUserUpdate([Role.COS], USER_GUID, "JSMITH", unlinkedRecord, { authUserGuid: "OTHERGUID" }),
    ).toThrow("Only an administrator can change these user details.");
  });
});
