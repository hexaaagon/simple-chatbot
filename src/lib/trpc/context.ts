import { db } from "@/lib/db/index";

export async function createTRPCContext(opts: { headers: Headers }) {
  return {
    db,
    ...opts,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
