import { decode } from "base64-arraybuffer";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import { createClient } from "@/lib/supabase/server";
import { initBucket } from "@/lib/supabase/utils/initBucket";

import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { nanoid } from "@/lib/utils";
import { getUrl } from "@/lib/supabase/utils/getUrl";
import { createReadStream, createWriteStream } from "fs";
import { Readable } from "stream";

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

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const init = await initBucket(supabase);
  if (!init.success)
    return Response.json(
      {
        success: false,
        error: init.error,
      },
      {
        status: 500,
      },
    );

  const ctx = await getCloudflareContext();
  const result = await ctx.env.AI.run(
    (body.params?.find((data) => data.name === "chat-ai-model")
      ?.value as BaseAiTextToImageModels) ??
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    {
      prompt: body.prompt,
    },
  );

  console.log("done 2", result);

  if (!(result instanceof ReadableStream))
    return Response.json(
      {
        success: false,
        error: `Invalid result, ${result || JSON.stringify(result)}, ${typeof result}`,
      },
      {
        status: 500,
      },
    );

  return new Response(result, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
