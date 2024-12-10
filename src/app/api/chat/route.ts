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

  const knowledge: string[] = [
    `Right now, the date and time is: "${new Date().toLocaleString("en-US", { timeZone: "UTC" })}" (UTC+0).`,
    `Your AI Model name is ${
      (body.params?.find((data) => data.name === "chat-ai-model")
        ?.value as BaseAiTextGenerationModels) ?? "@cf/meta/llama-3-8b-instruct"
    }`,
    "In the 'Strawberry' word, there is only 3 *R*. Here's the proof: st*r*awbe*r**r*y",
  ];

  const ctx = await getCloudflareContext();
  const result = (await ctx.env.AI.run(
    (body.params?.find((data) => data.name === "chat-ai-model")
      ?.value as BaseAiTextGenerationModels) ?? "@cf/meta/llama-3-8b-instruct",
    {
      messages: [
        {
          role: "system",
          content:
            body.params?.find((data) => data.name === "chat-ai-context")
              ?.value ?? "You are a helpful assistant.",
        },
        {
          role: "assistant",
          content: knowledge.join("\n"),
        },
        {
          role: "user",
          content: body.prompt,
        },
      ],
    },
  )) as {
    response?: string;
    tool_calls?: {
      name: string;
      arguments: unknown;
    }[];
  };

  return Response.json({
    success: true,
    result: result.response,
  });
}
