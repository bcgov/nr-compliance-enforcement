import { requestContext } from "../../../pg-session-extension/request-interceptor";
import { validateActivityAccess } from "./validate-activity-access";

describe("validateActivityAccess", () => {
  const runAs = (activityIdentifiers: string[] | undefined, fn: () => void) =>
    requestContext.run({ user: { app_user_activity_identifiers: activityIdentifiers } } as any, fn);

  it("allows a user with a role on the activity", () => {
    runAs(["activity-1", "activity-2"], () => expect(() => validateActivityAccess("activity-2")).not.toThrow());
  });

  it("rejects a user without a role on the activity", () => {
    runAs(["activity-1"], () =>
      expect(() => validateActivityAccess("activity-2")).toThrow(
        "You can only change activities you are assigned to or collaborating on.",
      ),
    );
  });

  it("rejects a user without any activities", () => {
    runAs(undefined, () => expect(() => validateActivityAccess("activity-1")).toThrow());
  });
});
