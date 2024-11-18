import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

const requestSchema = z.object({
  url: z.string().url("Invalid URL format."),
  apiKey: z.string().nonempty("API key is required."),
  categories: z.array(z.string()).default([
    "performance",
    "accessibility",
    "best-practices",
    "seo",
  ]),
});

async function analyzePage(
  urlToAnalyze: string,
  apiKey: string,
  categories: string[],
) {
  try {
    const baseUrl = new URL(
      "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
    );

    const queryParams = new URLSearchParams({
      url: urlToAnalyze,
      key: apiKey,
    });

    for (const category of categories) {
      queryParams.append("category", category);
    }

    const finalUrl = `${baseUrl}?${queryParams.toString()}`;

    const response = await fetch(finalUrl);

    if (!response.ok) {
      throw new Error(
        `HTTP Error ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error during PageSpeed analysis:", error);
    throw error;
  }
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const parsed = requestSchema.parse(body);

    const result = await analyzePage(
      parsed.url,
      parsed.apiKey,
      parsed.categories,
    );

    return new Response(JSON.stringify(result, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);

    return new Response(
      JSON.stringify({ error: error }, null, 2),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
});
