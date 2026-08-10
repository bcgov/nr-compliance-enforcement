import { Role } from "../../../enum/role.enum";
import { validateAgencyAccess } from "./validate-agency-access";

describe("validateAgencyAccess", () => {
  it("lets a global administrator manage any agency", () => {
    expect(() => validateAgencyAccess([Role.GLOBAL_ADMINISTRATOR], "PARKS")).not.toThrow();
  });

  it("lets a user manage their own agency", () => {
    expect(() => validateAgencyAccess([Role.COS], "COS")).not.toThrow();
  });

  it("rejects an agency the user does not belong to", () => {
    expect(() => validateAgencyAccess([Role.COS], "PARKS")).toThrow(
      "You can only manage legislation belonging to your own agency.",
    );
  });
});
