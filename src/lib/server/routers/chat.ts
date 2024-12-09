import { publicProcedure, router } from "@/lib/server/trpc";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";

export const chatRouter = router({
  generate: publicProcedure
    .input(
      z.object({
        input: z.string(),
        model: z
          .custom<BaseAiTextGenerationModels>()
          .default("@cf/meta/llama-3-8b-instruct"),
      })
    )
    .query(async (opts) => {
      const env = (await getCloudflareContext()).env;

      return await env.AI.run(opts.input.model, {
        prompt: opts.input.input,
      });
    }),
});
