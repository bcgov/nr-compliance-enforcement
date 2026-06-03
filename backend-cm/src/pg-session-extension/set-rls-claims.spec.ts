import { setRlsClaims } from "./set-rls-claims";

describe("setRlsClaims", () => {
  const makeTx = () => ({ $executeRawUnsafe: jest.fn().mockResolvedValue(undefined) });

  it("does nothing when there is no user", async () => {
    const tx = makeTx();
    await setRlsClaims(tx);
    expect(tx.$executeRawUnsafe).not.toHaveBeenCalled();
  });

  it("sets idir_user_guid, client_roles, agency_code and exp as SET LOCAL session variables", async () => {
    const tx = makeTx();
    await setRlsClaims(tx, {
      idir_user_guid: "abc-123",
      client_roles: ["COS"],
      exp: 1700000000,
    });

    expect(tx.$executeRawUnsafe).toHaveBeenCalledWith("SET LOCAL jwt.claims.idir_user_guid = 'abc-123'");
    expect(tx.$executeRawUnsafe).toHaveBeenCalledWith("SET LOCAL jwt.claims.client_roles = 'COS'");
    expect(tx.$executeRawUnsafe).toHaveBeenCalledWith("SET LOCAL jwt.claims.agency_code = 'COS'");
    expect(tx.$executeRawUnsafe).toHaveBeenCalledWith("SET LOCAL jwt.claims.exp = '1700000000'");
  });

  it("maps CEEB role -> EPO agency_code", async () => {
    const tx = makeTx();
    await setRlsClaims(tx, { idir_user_guid: "g", client_roles: ["CEEB"], exp: 1 });
    expect(tx.$executeRawUnsafe).toHaveBeenCalledWith("SET LOCAL jwt.claims.agency_code = 'EPO'");
  });

  it("maps MINES role -> MINES agency_code", async () => {
    const tx = makeTx();
    await setRlsClaims(tx, { idir_user_guid: "g", client_roles: ["MINES"], exp: 1 });
    expect(tx.$executeRawUnsafe).toHaveBeenCalledWith("SET LOCAL jwt.claims.agency_code = 'MINES'");
  });

  it("error when client_roles has no agency", async () => {
    const tx = makeTx();
    await expect(setRlsClaims(tx, { idir_user_guid: "g", client_roles: ["READ ONLY"], exp: 1 })).rejects.toThrow(
      /User agency is not configured correctly/,
    );
  });

  it("error when client_roles has multiple agencies", async () => {
    const tx = makeTx();
    await expect(setRlsClaims(tx, { idir_user_guid: "g", client_roles: ["COS", "PARKS"], exp: 1 })).rejects.toThrow(
      /User agency is not configured correctly/,
    );
  });

  it("joins an array of client_roles with commas", async () => {
    const tx = makeTx();
    await setRlsClaims(tx, { idir_user_guid: "g", client_roles: ["COS", "READ ONLY"], exp: 1 });
    expect(tx.$executeRawUnsafe).toHaveBeenCalledWith("SET LOCAL jwt.claims.client_roles = 'COS,READ ONLY'");
  });

  it("accepts client_roles as a plain string", async () => {
    const tx = makeTx();
    await setRlsClaims(tx, { idir_user_guid: "g", client_roles: "CEEB", exp: 1 });
    expect(tx.$executeRawUnsafe).toHaveBeenCalledWith("SET LOCAL jwt.claims.client_roles = 'CEEB'");
  });

  it("defaults exp to 0 when not provided", async () => {
    const tx = makeTx();
    await setRlsClaims(tx, { idir_user_guid: "g", client_roles: "COS" });
    expect(tx.$executeRawUnsafe).toHaveBeenCalledWith("SET LOCAL jwt.claims.exp = '0'");
  });

  it("escapes single quotes in claim values", async () => {
    const tx = makeTx();
    await setRlsClaims(tx, { idir_user_guid: "o'brien", client_roles: "COS", exp: 1 });
    expect(tx.$executeRawUnsafe).toHaveBeenCalledWith("SET LOCAL jwt.claims.idir_user_guid = 'o''brien'");
  });

  it("skips idir_user_guid / client_roles when they are falsy but always sets exp", async () => {
    const tx = makeTx();
    await setRlsClaims(tx, { exp: 5 });
    expect(tx.$executeRawUnsafe).toHaveBeenCalledTimes(1);
    expect(tx.$executeRawUnsafe).toHaveBeenCalledWith("SET LOCAL jwt.claims.exp = '5'");
  });
});
