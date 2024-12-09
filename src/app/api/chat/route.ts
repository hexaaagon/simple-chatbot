import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = req.json() as {
    input?: string;
    model?: BaseAiTextGenerationModels;
  };

  if (!body.input)
    return Response.json(
      {
        success: false,
        error: "No input provided",
      },
      {
        status: 400,
      },
    );

  const ctx = await getCloudflareContext();
  const result = await ctx.env.AI.run(
    body.model ?? "@cf/meta/llama-3-8b-instruct",
    {
      prompt: body.input,
    },
  );

  return Response.json({
    success: true,
    result: result,
  });
}
