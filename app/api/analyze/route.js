import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request) {
  try {
    let apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.VERTEX_API_KEY;

    try {
      const ctx = getRequestContext();
      if (ctx?.env?.GEMINI_API_KEY) {
        apiKey = ctx.env.GEMINI_API_KEY;
      } else if (ctx?.env?.VERTEX_API_KEY) {
        apiKey = ctx.env.VERTEX_API_KEY;
      }
    } catch (e) {
      // getRequestContext may throw when running outside Cloudflare edge worker environment
    }

    if (!apiKey) {
      return Response.json({ 
        error: "GEMINI_API_KEY environment variable is not configured. Please add GEMINI_API_KEY in Cloudflare Pages Settings -> Environment Variables/Secrets (or .env.local for local development)." 
      }, { status: 500 });
    }

    const body = await request.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return Response.json({ error: "Missing imageBase64 parameter." }, { status: 400 });
    }

    const systemPrompt = `You are the design intelligence engine for StitchBox. Deconstruct the uploaded website screenshot and extract its complete Design DNA across three dimensions: Measurable Design System Tokens, Qualitative Design Style, and Visual Effects Rendering into a clean JSON object.

Examine the screenshot with high fidelity:
- Sample exact dominant color hex values for surface background, cards, primary headlines, accent buttons, and body typography.
- Identify specific font classifications (e.g. 'Grotesk Display', 'Serif', 'Geometric Sans', 'Monospace').
- Measure layout density, container border-radius, and border style.
- Detect special visual effects (e.g., 1-bit dither, topographic lines, halftone, glassmorphism, noise grain).

Generate the output matching this exact JSON schema:
{
  "creativeName": "An evocative, creative, synthesized name for the design identity (e.g. 'Proteomics Ink', 'Dither Mono', 'Print-Tech Paper')",
  "summary": "A precise, 2-3 sentence visual summary detailing the design's layout hierarchy, color palette, typography rhythm, and unique aesthetic feel.",
  "tokens": ["8 to 12 explicit, lowercase aesthetic tags representing colors, fonts, layouts, and textures used"],
  "baseTags": ["Subset matching at least one of: 'Editorial', 'SaaS/B2B', 'Brutalist', 'Consumer', 'Mono', 'Textured'"],
  "recipe": {
    "aestheticFamily": "A 2-word family name (e.g., 'tactile-technical', 'brutalist-editorial', 'clean-minimalism')",
    "vocabularyTerms": ["6 to 8 specific design descriptors"],
    "feel": "The raw sensory and emotional feel of the layout",
    "intent": "The strategic visual purpose of the interface",
    "alwaysRules": ["4 to 6 concrete, strict layout, typography, color, and styling rules required to recreate this exact UI"],
    "neverRules": ["4 to 6 strict anti-patterns and styling bans to avoid"],
    "designSystem": {
      "color": {
        "primary": "#hex for main headline/brand color",
        "secondary": "#hex for borders and muted elements",
        "accent": "#hex for call-to-action buttons or highlights",
        "surface": "#hex for overall main page background",
        "card": "#hex for container/card background",
        "neutralText": "#hex for main body typography"
      },
      "typography": {
        "headingFont": "Specific font style or classification (e.g. 'Grotesk Display', 'Serif', 'Geometric Sans')",
        "bodyFont": "Specific body font family (e.g. 'Inter', 'JetBrains Mono', 'System Sans')",
        "scaleRatio": "Typographic scale ratio e.g. '1.25', '1.33', or '1.414'",
        "letterSpacing": "Tracking style e.g. 'tight', 'normal', 'wide-mono'"
      },
      "spacing": {
        "baseUnit": "Base grid unit e.g. '4px', '8px', '12px'",
        "density": "'compact', 'comfortable', or 'spacious'"
      },
      "shape": {
        "borderRadius": "Container border radius e.g. '0px', '4px', '12px', '24px'",
        "borderStyle": "Border style e.g. '1px solid rgba(255,255,255,0.1)', '1px solid #333', 'none'"
      }
    },
    "visualEffects": {
      "glassmorphism": {
        "enabled": true or false,
        "blurRadius": "e.g. '12px' or '0px'",
        "transparency": "e.g. '0.85' or '1.0'"
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
      return Response.json({ error: "Empty response received from Gemini AI model." }, { status: 500 });
    }

    const parsedDNA = JSON.parse(rawText);
    return Response.json({ success: true, dna: parsedDNA });

  } catch (error) {
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
