import { withRlsBypass } from "./with-rls-bypass";
import { rlsBypassContext } from "./prisma-pg-session-extension";

describe("withRlsBypass", () => {
  it("runs the callback and returns its result", async () => {
    const result = await withRlsBypass(async () => "ok");
    expect(result).toBe("ok");
  });

  it("marks rlsBypassContext while the callback runs", async () => {
    expect(rlsBypassContext.getStore()).toBeUndefined();
    const insideValue = await withRlsBypass(async () => rlsBypassContext.getStore());
    expect(insideValue).toBe(true);
    expect(rlsBypassContext.getStore()).toBeUndefined();
  });

  it("keeps the bypass active across awaits inside the callback", async () => {
    const seen = await withRlsBypass(async () => {
      const before = rlsBypassContext.getStore();
      await Promise.resolve();
      const after = rlsBypassContext.getStore();
      return { before, after };
    });
    expect(seen).toEqual({ before: true, after: true });
  });

  it("keeps the bypass active for work started with Promise.all", async () => {
    const stores = await withRlsBypass(async () =>
      Promise.all([
        Promise.resolve().then(() => rlsBypassContext.getStore()),
        Promise.resolve().then(() => rlsBypassContext.getStore()),
      ]),
    );
    expect(stores).toEqual([true, true]);
  });

  it("propagates errors and clears the bypass afterwards", async () => {
    await expect(
      withRlsBypass(async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    expect(rlsBypassContext.getStore()).toBeUndefined();
  });
});
