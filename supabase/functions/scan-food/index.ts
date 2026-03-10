import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { imageBase64, foodText } = await req.json();

    let userContent: any[];

    if (imageBase64) {
      userContent = [
        {
          type: "text",
          text: `Analyze this food image. Identify the food items and estimate the nutritional content. Return ONLY a JSON object with this exact structure, no markdown, no code blocks:
{"food": "Food Name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0, "items": ["item1", "item2"]}
Where calories is in kcal and protein/carbs/fat/fiber are in grams. "items" lists individual food items detected. Be realistic with estimates.`,
        },
        {
          type: "image_url",
          image_url: { url: imageBase64 },
        },
      ];
    } else if (foodText) {
      userContent = [
        {
          type: "text",
          text: `Estimate the nutritional content for: "${foodText}". Assume a typical serving size. Return ONLY a JSON object with this exact structure, no markdown, no code blocks:
{"food": "Food Name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0, "items": ["${foodText}"]}
Where calories is in kcal and protein/carbs/fat/fiber are in grams. Be realistic with estimates.`,
        },
      ];
    } else {
      return new Response(
        JSON.stringify({ error: "No image or food text provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are a nutrition analysis expert. Analyze food and provide accurate calorie and macro estimates. Always respond with valid JSON only, no markdown formatting.",
            },
            { role: "user", content: userContent },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error [${response.status}]: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the response, handling possible markdown wrapping
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    }

    const nutrition = JSON.parse(cleaned);

    return new Response(JSON.stringify(nutrition), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Food scanner error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
