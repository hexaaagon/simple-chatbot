import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    prompt?: string;
    params?: Array<{
      name: string;
      value: string;
    }>;
  };

  if (!body.prompt)
    return Response.json(
      {
        success: false,
        error: "No prompt provided",
      },
      {
        status: 400,
      },
    );

  const ctx = await getCloudflareContext();
  const result = await ctx.env.AI.run("@cf/facebook/bart-large-cnn", {
    input_text: body.prompt,
  });

  return Response.json({
    success: true,
    result: result.summary,
  });
}
