import { chatRouter } from "./chat";
import { router } from "@/lib/server/trpc";

export const appRouter = router({
  // chat: chatRouter,
});

export type AppRouter = typeof appRouter;
