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
        error: "GEMINI_API_KEY environment variable is not configured. Please add GEMINI_API_KEY in Cloudflare Pages Settings -> Environment Variables/Secrets." 
      }, { status: 500 });
    }

    const body = await request.json();
    const { imageBase64, mimeType, existingItems } = body;

    if (!imageBase64) {
      return Response.json({ error: "Missing imageBase64 parameter." }, { status: 400 });
    }

    // 1. Dynamically query Google AI Studio ListModels to discover currently supported models for this key
    let availableModelNames = [];
    let listModelsError = null;

    try {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (listRes.ok) {
        const listData = await listRes.json();
        if (Array.isArray(listData.models)) {
          availableModelNames = listData.models
            .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name); // e.g. ["models/gemini-2.5-flash-lite", "models/gemini-2.0-flash", ...]
        }
      } else {
        listModelsError = await listRes.text();
      }
    } catch (err) {
      listModelsError = err.message;
    }

    // Explicit model priority list starting with gemini-2.5-flash-lite
    const preferredOrder = [
      "models/gemini-2.5-flash-lite",
      "models/gemini-2.5-flash-lite-latest",
      "models/gemini-2.5-flash",
      "models/gemini-2.0-flash-lite",
      "models/gemini-2.0-flash-lite-preview-02-05",
      "models/gemini-2.0-flash",
      "models/gemini-2.0-flash-exp",
      "models/gemini-1.5-flash",
      "models/gemini-1.5-flash-latest"
    ];

    if (availableModelNames.length === 0) {
      availableModelNames = preferredOrder;
    } else {
      // Sort models according to preferredOrder, pushing unrecognized models to the end
      availableModelNames.sort((a, b) => {
        const idxA = preferredOrder.indexOf(a);
        const idxB = preferredOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      });
      // Always ensure preferred models are attempted first
      preferredOrder.forEach(model => {
        if (!availableModelNames.includes(model)) {
          availableModelNames.unshift(model);
        }
      });
    }

    // Format existing collection context if provided
    let collectionContext = "";
    if (Array.isArray(existingItems) && existingItems.length > 0) {
      const itemSummaries = existingItems.map(item => `- "${item.creativeName || 'Asset'}": Tags=[${(item.baseTags || []).join(', ')}], Tokens=[${(item.tokens || []).slice(0, 5).join(', ')}]`).join('\n');
      collectionContext = `\n\nCURRENT COLLECTION CONTEXT:\nThe board currently contains the following assets:\n${itemSummaries}\nAnalyze the uploaded image in relation to the current collection above so that generated baseTags reflect and categorize this item accurately within the overall collection taxonomy.`;
    }

    const systemPrompt = `You are the design intelligence engine for StitchBox operating on Gemini 2.5 Flash-Lite. Deconstruct the uploaded website screenshot and extract its complete Design DNA across three dimensions: Measurable Design System Tokens, Qualitative Design Style, and Visual Effects Rendering into a clean JSON object.${collectionContext}

Examine the screenshot with high fidelity:
- Sample exact dominant color hex values for surface background, cards, primary headlines, accent buttons, and body typography.
- Identify specific font classifications (e.g. 'Grotesk Display', 'Serif', 'Geometric Sans', 'Monospace').
- Measure layout density, container border-radius, and border style.
- Detect special visual effects (e.g., 1-bit dither, topographic lines, halftone, glassmorphism, noise grain).
- Generate dynamic, contextual baseTags (1 to 3 high-level categories/tags) that categorize this asset in relation to the collection created (e.g., 'SaaS/B2B', 'Editorial', 'Brutalist', 'Consumer', 'Developer Tools', 'Fintech', 'Portfolio', 'E-Commerce', 'Dark Mode', 'Minimalist').

Generate the output matching this exact JSON schema:
{
  "creativeName": "An evocative, creative, synthesized name for the design identity (e.g. 'Proteomics Ink', 'Dither Mono', 'Print-Tech Paper')",
  "summary": "A precise, 2-3 sentence visual summary detailing the design's layout hierarchy, color palette, typography rhythm, and unique aesthetic feel.",
  "tokens": ["8 to 12 explicit, lowercase aesthetic tags representing colors, fonts, layouts, and textures used"],
  "baseTags": ["1 to 3 dynamic high-level taxonomy tags reflecting the visual style and functional category of the asset relative to the collection"],
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

    let lastError = null;
    let parsedDNA = null;

    for (const fullModelPath of availableModelNames) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/${fullModelPath}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload)
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          try {
            parsedDNA = JSON.parse(rawText);
            break;
          } catch (e) {
            lastError = `Failed to parse JSON output from ${fullModelPath}`;
          }
        }
      } else {
        const errText = await response.text();
        lastError = `${fullModelPath} returned status ${response.status}: ${errText}`;
      }
    }

    if (!parsedDNA) {
      return Response.json({ 
        error: `Gemini API call failed across available models (${availableModelNames.join(', ')}). Last error: ${lastError || listModelsError}` 
      }, { status: 500 });
    }

    return Response.json({ success: true, dna: parsedDNA });

  } catch (error) {
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
