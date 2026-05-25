import { rlsBypassContext } from "./prisma-pg-session-extension";

// Deliberately run reads WITHOUT JWT claims bypassing RLS
export async function withRlsBypass<T>(fn: () => Promise<T>): Promise<T> {
  return rlsBypassContext.run(true, fn);
}
