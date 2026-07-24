export const runtime = 'edge';

export async function POST(request) {
  try {
    const apiKey = process.env.VERTEX_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ 
        error: "Cloud Managed API Key is not configured on this Cloudflare deployment. Please set VERTEX_API_KEY or GEMINI_API_KEY in Environment Variables." 
      }, { status: 500 });
    }

    const body = await request.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return Response.json({ error: "Missing imageBase64 parameter." }, { status: 400 });
    }

    const systemPrompt = `You are the design intelligence engine for StitchBox. Analyze the uploaded website screenshot and extract its design DNA into a clean JSON object. 

Deconstruct the design into structural, typographic, color, and functional patterns, avoiding generic marketing terms in favor of precise, conventional UX, typography, and design vocabulary.

Generate the output matching this exact JSON schema:
{
  "creativeName": "A synthesized, creative, evocative name for the style (e.g., 'Dither Mono', 'Print-Tech Paper')",
  "summary": "A short, inspired 2-3 sentence summary of the design's overall aesthetic impact and mood",
  "tokens": ["Minimum 6, maximum 12 explicit, lowercase aesthetic tags representing colors, fonts, layouts, and textures used"],
  "baseTags": ["A subset list matching at least one of these exact values: 'Editorial', 'SaaS/B2B', 'Brutalist', 'Consumer', 'Mono', 'Textured'"],
  "recipe": {
    "aestheticFamily": "A 2-word family name (e.g., 'brutalist-editorial', 'clean-minimalism')",
    "vocabularyTerms": ["5 to 8 specific design descriptors"],
    "feel": "The raw sensory feel of the reference design",
    "intent": "The visual purpose or perceived strategic goal of the layout",
    "alwaysRules": ["3-5 concrete layout, color, typography, or styling rules that must always be present to recreate this aesthetic"],
    "neverRules": ["3-5 concrete styling choices, layout patterns, or color treatments to strictly avoid"]
  }
}`;

    const geminiPayload = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "image/png",
                data: imageBase64
              }
            },
            {
              text: systemPrompt
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ 
        error: `Gemini API call failed with status ${response.status}: ${errText}` 
      }, { status: response.status });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return Response.json({ error: "Empty response received from AI model." }, { status: 500 });
    }

    const parsedDNA = JSON.parse(rawText);
    return Response.json({ success: true, dna: parsedDNA });

  } catch (error) {
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
