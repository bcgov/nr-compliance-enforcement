import { withRlsTransaction } from "./with-rls-transaction";
import { inTransactionContext } from "./prisma-pg-session-extension";
import * as requestInterceptor from "./request-interceptor";

describe("withRlsTransaction", () => {
  // $transaction synchronously invokes its callback with `db`, capturing SET LOCAL statements.
  const makePrisma = () => {
    const executed: string[] = [];
    const db: any = {
      $executeRawUnsafe: jest.fn((sql: string) => {
        executed.push(sql);
        return Promise.resolve();
      }),
    };
    const prisma: any = {
      $transaction: jest.fn((cb: (db: any) => Promise<unknown>, _opts?: unknown) => cb(db)),
    };
    return { prisma, db, executed };
  };

  afterEach(() => jest.restoreAllMocks());

  it("runs the callback inside prisma.$transaction and returns its result", async () => {
    const { prisma, db } = makePrisma();
    jest.spyOn(requestInterceptor, "getRequest").mockReturnValue(undefined);

    const result = await withRlsTransaction(prisma, async (passedDb) => {
      expect(passedDb).toBe(db);
      return "ok";
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(result).toBe("ok");
  });

  it("sets the request user's JWT claims before running the callback", async () => {
    const { prisma, executed } = makePrisma();
    jest.spyOn(requestInterceptor, "getRequest").mockReturnValue({
      user: { idir_user_guid: "u1", client_roles: ["PARKS"], exp: 999 },
    } as any);

    await withRlsTransaction(prisma, async () => undefined);

    expect(executed).toEqual([
      "SET LOCAL jwt.claims.idir_user_guid = 'u1'",
      "SET LOCAL jwt.claims.client_roles = 'PARKS'",
      "SET LOCAL jwt.claims.agency_code = 'PARKS'",
      "SET LOCAL jwt.claims.exp = '999'",
    ]);
  });

  it("does not set claims when there is no request user", async () => {
    const { prisma, executed } = makePrisma();
    jest.spyOn(requestInterceptor, "getRequest").mockReturnValue(undefined);

    await withRlsTransaction(prisma, async () => undefined);

    expect(executed).toEqual([]);
  });

  it("marks inTransactionContext while the callback runs", async () => {
    const { prisma } = makePrisma();
    jest.spyOn(requestInterceptor, "getRequest").mockReturnValue(undefined);

    expect(inTransactionContext.getStore()).toBeUndefined();
    const insideValue = await withRlsTransaction(prisma, async () => inTransactionContext.getStore());
    expect(insideValue).toBe(true);
    expect(inTransactionContext.getStore()).toBeUndefined();
  });

  it("forwards transaction options to prisma.$transaction", async () => {
    const { prisma } = makePrisma();
    jest.spyOn(requestInterceptor, "getRequest").mockReturnValue(undefined);

    await withRlsTransaction(prisma, async () => undefined, { maxWait: 1234, timeout: 5678 });

    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), { maxWait: 1234, timeout: 5678 });
  });

  it("propagates errors thrown by the callback", async () => {
    const { prisma } = makePrisma();
    jest.spyOn(requestInterceptor, "getRequest").mockReturnValue(undefined);

    await expect(
      withRlsTransaction(prisma, async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
  });
});
