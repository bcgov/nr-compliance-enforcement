import { UnauthorizedException } from "@nestjs/common";
import { UnauthorizedAccessException, UNAUTHORIZED_ERROR_CODE } from "./unauthorized-access.exception";

describe("UnauthorizedAccessException", () => {
  it("is a 401 UnauthorizedException", () => {
    const ex = new UnauthorizedAccessException();
    expect(ex).toBeInstanceOf(UnauthorizedException);
    expect(ex.getStatus()).toBe(401);
  });

  it("has a generic default message", () => {
    expect(new UnauthorizedAccessException().message).toBe("You do not have access to this resource.");
  });

  it("accepts a custom message", () => {
    expect(new UnauthorizedAccessException("You do not have access to this case file.").message).toBe(
      "You do not have access to this case file.",
    );
  });

  it("exposes UNAUTHORIZED_ERROR_CODE", () => {
    expect(UNAUTHORIZED_ERROR_CODE).toBe("UNAUTHORIZED");
  });
});
