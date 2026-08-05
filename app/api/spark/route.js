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
        error: "GEMINI_API_KEY environment variable is not configured." 
      }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const { previousSubjects = [] } = body;

    const configuredModel = process.env.GEMINI_MODEL;
    const candidateModels = [
      ...(configuredModel ? [configuredModel.startsWith("models/") ? configuredModel : `models/${configuredModel}`] : []),
      "models/gemini-flash-latest",
      "models/gemini-flash-lite-latest"
    ];

    const domains = [
      "astrobiology & exoplanet atmospheric research",
      "quantum computing & subatomic particle superposition",
      "deep sea benthic oceanography & abyssal exploration",
      "cybernetics & neural interface telemetry",
      "archival tactile vinyl record acoustics & sonic preservation",
      "mycorrhizal fungal subterranean network biology",
      "orbital mechanics & space debris salvage logistics",
      "autonomous swarm robotics & aerial drone choreography",
      "generative typography & algorithmic typesetting rules",
      "brutalist architecture & industrial concrete structural analysis",
      "microbiome genetics & synthetic bio-engineering",
      "high-frequency algorithmic liquidity trading",
      "volcanic geothermal energy distribution grids",
      "bioluminescent flora cultivation & ambient light synthesis",
      "vintage modular analog synthesizer patching",
      "kinetic sculpture & mechanical clockwork horology",
      "holographic spatial computing & volumetric rendering",
      "retro-computing CRT raster terminal emulation",
      "aerospace hypersonic flight telemetry",
      "paleontology ice core climate analytics",
      "urban guerilla gardening & rooftop micro-agriculture",
      "algorithmic generative textile weaving & garment CAD"
    ];

    const designAesthetics = [
      "Print-Tech Paper styling with topo-ink overlays",
      "Dithered Monochromatic Wireframe with Neon Cyan Accents",
      "Vast Quiet Cinematic fog borders",
      "Brutalist Monospaced typographic grid layout",
      "Neumorphic Dark Mode glassmorphic glow",
      "Editorial Serif headlines on warm tactile parchment",
      "High-contrast Brutalist Swiss Style grid",
      "Retro-Futuristic CRT Raster phosphor glow",
      "Bauhaus Minimalist geometric primary color blocking",
      "Industrial Tactical Monochrome with high-visibility yellow highlights"
    ];

    const chosenDomain = domains[Math.floor(Math.random() * domains.length)];
    const chosenAesthetic = designAesthetics[Math.floor(Math.random() * designAesthetics.length)];
    const randomSeed = Math.floor(Math.random() * 1000000);

    let exclusionInstruction = "";
    if (Array.isArray(previousSubjects) && previousSubjects.length > 0) {
      const recent = previousSubjects.slice(-15);
      exclusionInstruction = `\nDo NOT generate any concepts similar to or matching these recently generated subjects:\n${recent.map(s => `- "${s}"`).join('\n')}\n`;
    }

    const systemPrompt = `You are an infinitely creative AI prompt generator for a high-end design inspiration tool called StitchBox.
Your task is to invent a single, completely original, wild, visionary concept challenge idea for a web application or digital product experience.

Domain Focus Seed: ${chosenDomain}
Aesthetic Seed: ${chosenAesthetic}
Randomization Seed: ${randomSeed}
${exclusionInstruction}

CRITICAL RULES:
1. Every concept must feel wild, unexpected, specific, imaginative, and deeply inventive.
2. Avoid generic corporate software, simple SaaS dashboards, or basic e-commerce templates.
3. Keep the "subject" concise (10-15 words) starting with "a" or "an".
4. Format output strictly as JSON with "subject" and "style" fields.

JSON Output Schema:
{
  "subject": "a concise, wild, evocative concept subject (e.g. 'an orbital space debris salvage logistics terminal')",
  "style": "a distinct, high-impact visual design style rule (e.g. 'Dithered Monochromatic Wireframe with Neon Cyan Accents')"
}`;

    const payload = {
      contents: [{
        parts: [{ text: `Generate a new wild concept challenge for domain: ${chosenDomain}. Seed: ${randomSeed}` }]
      }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 1.1,
        topP: 0.95,
        responseMimeType: "application/json"
      }
    };

    let lastError = null;
    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            if (parsed && parsed.subject) {
              return Response.json({ success: true, spark: parsed });
            }
          }
        } else {
          const errText = await res.text();
          lastError = `Model ${model} returned HTTP ${res.status}: ${errText}`;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    return Response.json({ error: lastError || "Failed to generate spark via Gemini" }, { status: 500 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
