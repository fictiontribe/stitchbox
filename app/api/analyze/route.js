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
    let { imageBase64, imageUrl, mimeType, existingItems } = body;

    if (!imageBase64 && imageUrl) {
      try {
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) {
          return Response.json({ error: `Failed to fetch image from URL: HTTP ${imgRes.status}` }, { status: 400 });
        }
        const arrayBuffer = await imgRes.arrayBuffer();
        mimeType = imgRes.headers.get('content-type') || 'image/png';
        if (typeof Buffer !== 'undefined') {
          imageBase64 = Buffer.from(arrayBuffer).toString('base64');
        } else {
          let binary = '';
          const bytes = new Uint8Array(arrayBuffer);
          const len = bytes.byteLength;
          const chunkSize = 8192;
          for (let i = 0; i < len; i += chunkSize) {
            const chunk = bytes.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, chunk);
          }
          imageBase64 = btoa(binary);
        }
      } catch (err) {
        return Response.json({ 
          error: `Unable to download image from URL (${imageUrl}). Error: ${err.message}` 
        }, { status: 400 });
      }
    }

    if (!imageBase64) {
      return Response.json({ error: "Missing imageBase64 or imageUrl parameter." }, { status: 400 });
    }

    // Alias-first model selection strategy to prevent breakage from model deprecations
    const configuredModel = process.env.GEMINI_MODEL;
    const candidateModels = [
      ...(configuredModel ? [configuredModel.startsWith("models/") ? configuredModel : `models/${configuredModel}`] : []),
      "models/gemini-flash-latest",
      "models/gemini-flash-lite-latest"
    ];

    // Format existing collection context if provided
    let collectionContext = "";
    if (Array.isArray(existingItems) && existingItems.length > 0) {
      const itemSummaries = existingItems.slice(0, 8).map(item => `- "${item.creativeName || 'Asset'}": Tags=[${(item.baseTags || []).join(', ')}], Tokens=[${(item.tokens || []).slice(0, 4).join(', ')}]`).join('\n');
      collectionContext = `\n\nCURRENT COLLECTION CONTEXT:\nThe board currently contains the following assets:\n${itemSummaries}\nAnalyze the uploaded image in relation to the collection above so that generated baseTags reflect and categorize this item accurately within the overall collection taxonomy.`;
    }

    const systemPrompt = `You are the chief design and visual art direction intelligence engine for StitchBox operating on Gemini. Deconstruct the uploaded asset screenshot/image with hyper-fidelity visual graphic and image processing, capturing both UI structure AND graphic art direction DNA across four dimensions: Functional Category, Measurable Design System Tokens, Graphic/Visual Aesthetic DNA, and Visual Rendering Effects into a clean JSON object.${collectionContext}

Examine the full image from top to bottom across all visible sections, banners, cards, footers, buttons, typography, and graphic callouts:
- DEEP GRAPHIC & COLOR PALETTE EXTRACTION RULES:
  * SCAN THE ENTIRE IMAGE FROM TOP TO BOTTOM including hero header, middle content blocks, cards, badges, buttons, footers, and accents.
  * Extract 6 DISTINCT, RICH, DIVERSE 6-DIGIT HEX CODES representing the complete visual palette of the design.
  * DO NOT return duplicate #ffffff or rgba(...) values across multiple swatch slots unless the image is 100% monochromatic white.
  * ALL COLOR SWATCHES MUST BE VALID 6-DIGIT HEX STRINGS starting with '#' (e.g. #0d5c75, #f88362, #004b57, #f7f5f0, #1e293b, #ffffff). NEVER output 'rgba(...)' or invalid color strings.
  * Color slot mapping:
    1. lightBase: light canvas/surface background (e.g. #f7f5f0 or #ffffff)
    2. darkBase: dark container/section/footer background (e.g. #0d5c75 or #0f172a)
    3. primary: primary brand / main headline color
    4. secondary: secondary accent, border, or card background
    5. accent: key call-to-action button, badge, or vibrant highlight color (e.g. teal, coral, orange)
    6. neutralText: main body typography color
- Classify the asset into EXACTLY ONE of these 5 categories: 'Website', 'Photography', 'Graphics', 'Branding & Identity', or 'Editorial & Print'.
- Identify specific font classifications (e.g. 'Grotesk Display', 'Editorial Serif', 'Geometric Sans', 'Technical Monospace').
- Select 1 to 2 baseTags ONLY from this canonical taxonomy cluster list: ['Website', 'Mobile & App', 'Graphics & Motion', 'Branding & Identity', 'Editorial & Print', 'UI & SaaS', 'Photography', 'Minimal & Brutalist']. Put all other granular, expanded tags into 'tokens'.

Generate output matching this exact JSON schema:
{
  "creativeName": "An evocative, creative, synthesized name for the design identity (e.g. 'Yoga Alliance Coral Teal', 'Proteomics Ink', 'Dither Mono')",
  "category": "One of: 'Website', 'Photography', 'Graphics', 'Branding & Identity', or 'Editorial & Print'",
  "summary": "A precise, 2-3 sentence visual summary detailing the design's layout hierarchy, color palette, typography rhythm, and unique aesthetic feel.",
  "tokens": ["8 to 12 explicit, lowercase aesthetic tags representing granular styles, colors, fonts, layouts, and textures used"],
  "baseTags": ["1 to 2 tags strictly chosen from: 'Website', 'Mobile & App', 'Graphics & Motion', 'Branding & Identity', 'Editorial & Print', 'UI & SaaS', 'Photography', 'Minimal & Brutalist'"],
  "recipe": {
    "aestheticFamily": "A 2-word family name (e.g., 'tactile-technical', 'organic-wellness', 'clean-minimalism')",
    "vocabularyTerms": ["6 to 8 specific design descriptors"],
    "feel": "The raw sensory and emotional feel of the layout",
    "intent": "The strategic visual purpose of the interface",
    "alwaysRules": ["4 to 6 concrete, strict layout, typography, color, and styling rules required to recreate this exact UI"],
    "neverRules": ["4 to 6 strict anti-patterns and styling bans to avoid"],
    "designSystem": {
      "color": {
        "lightBase": "#6-digit-hex for light surface",
        "darkBase": "#6-digit-hex for dark container/footer",
        "primary": "#6-digit-hex for main headline/brand color",
        "secondary": "#6-digit-hex for secondary accent/border",
        "accent": "#6-digit-hex for CTA button or highlight",
        "neutralText": "#6-digit-hex for body text",
        "swatches": ["Array of exactly 6 distinct 6-digit hex color strings: [lightBase, darkBase, primary, secondary, accent, neutralText]"]
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

    for (const fullModelPath of candidateModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/${fullModelPath}:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiPayload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            parsedDNA = JSON.parse(rawText);
            break;
          }
        } else {
          const errText = await response.text();
          lastError = `${fullModelPath} returned HTTP ${response.status}: ${errText}`;
        }
      } catch (err) {
        lastError = `${fullModelPath} call failed: ${err.message}`;
      }
    }

    if (!parsedDNA) {
      return Response.json({ 
        error: `Gemini API call failed (${candidateModels.join(', ')}). Last error: ${lastError}` 
      }, { status: 500 });
    }

    // Sanitize and normalize color swatches
    if (parsedDNA?.recipe?.designSystem?.color) {
      const color = parsedDNA.recipe.designSystem.color;
      
      const cleanHex = (val, fallback) => {
        if (!val || typeof val !== 'string') return fallback;
        if (/^#[0-9a-fA-F]{6}$/i.test(val)) return val;
        if (/^#[0-9a-fA-F]{3}$/i.test(val)) {
          return '#' + val[1] + val[1] + val[2] + val[2] + val[3] + val[3];
        }
        return fallback;
      };

      color.lightBase = cleanHex(color.lightBase, '#ffffff');
      color.darkBase = cleanHex(color.darkBase, '#0f172a');
      color.primary = cleanHex(color.primary, '#0f172a');
      color.secondary = cleanHex(color.secondary, '#475569');
      color.accent = cleanHex(color.accent, '#3b82f6');
      color.neutralText = cleanHex(color.neutralText, '#1e293b');

      if (!Array.isArray(color.swatches) || color.swatches.length < 6) {
        color.swatches = [
          color.lightBase,
          color.darkBase,
          color.primary,
          color.secondary,
          color.accent,
          color.neutralText
        ];
      } else {
        color.swatches = color.swatches.map((s, idx) => {
          const fallbacks = [color.lightBase, color.darkBase, color.primary, color.secondary, color.accent, color.neutralText];
          return cleanHex(s, fallbacks[idx] || '#334155');
        });
      }

      // Deduplicate plain white (#ffffff) or black swatches to guarantee 6 distinct vibrant palette colors
      const seen = new Set();
      const distinctPool = [
        color.accent,
        color.darkBase,
        color.secondary,
        color.primary,
        color.lightBase,
        color.neutralText,
        '#0d5c75',
        '#f88362',
        '#1e293b',
        '#f7f5f0',
        '#047857'
      ].filter(Boolean);

      color.swatches = color.swatches.map((s) => {
        const lower = s.toLowerCase();
        if (seen.has(lower) && (lower === '#ffffff' || lower === '#fff' || lower === '#000000' || lower === '#000')) {
          const alt = distinctPool.find(p => !seen.has(p.toLowerCase())) || '#0d5c75';
          seen.add(alt.toLowerCase());
          return alt;
        }
        seen.add(lower);
        return s;
      });
    }

    return Response.json({ success: true, dna: parsedDNA });

  } catch (error) {
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
