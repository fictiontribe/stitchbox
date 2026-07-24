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

    const systemPrompt = `You are the design intelligence engine for StitchBox. Deconstruct the uploaded website screenshot and extract its complete Design DNA across three dimensions: Measurable Design System Tokens, Qualitative Design Style, and Visual Effects Rendering into a clean JSON object.

Sample exact color hex values by area dominance, identify specific font classifications, measure layout density and border radius, and detect special visual effects.

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
    "neverRules": ["3-5 concrete styling choices, layout patterns, or color treatments to strictly avoid"],
    "designSystem": {
      "color": {
        "primary": "#hex for main brand/headline color",
        "secondary": "#hex for secondary elements/borders",
        "accent": "#hex for primary call-to-action button or highlight",
        "surface": "#hex for overall page background",
        "card": "#hex for card or container background",
        "neutralText": "#hex for main body typography"
      },
      "typography": {
        "headingFont": "Specific font style or classification (e.g., 'Grotesk Display', 'Geometric Sans', 'Serif')",
        "bodyFont": "Specific body font family (e.g., 'Inter', 'JetBrains Mono', 'System Sans')",
        "scaleRatio": "Typographic scale ratio e.g. '1.25' or '1.33'",
        "letterSpacing": "Tracking style e.g. 'tight', 'normal', 'wide-mono'"
      },
      "spacing": {
        "baseUnit": "Base grid spacing unit e.g. '4px', '8px', '12px'",
        "density": "'compact', 'comfortable', or 'spacious'"
      },
      "shape": {
        "borderRadius": "Main container border radius e.g. '0px', '4px', '12px', '9999px'",
        "borderStyle": "Border treatment e.g. '1px solid rgba(255,255,255,0.1)', '2px solid #000', 'none'"
      }
    },
    "visualEffects": {
      "glassmorphism": {
        "enabled": true or false,
        "blurRadius": "Blur amount e.g. '12px' or '0px'",
        "transparency": "Surface transparency e.g. '0.85' or '1.0'"
      },
      "textureField": {
        "enabled": true or false,
        "type": "'1-bit dither', 'halftone', 'topographic-lines', 'noise-grain', 'gradient-mesh', 'none'"
      },
      "renderingTier": "'lightweight', 'medium', or 'heavy'"
    }
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
