import { generateContent, jsonOf } from '../../../lib/ft-ai.mjs';
import { aiEnv } from '../../../lib/ai';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const env = aiEnv();
    if (!env) {
      return Response.json({ error: "The FT_AI gateway binding is not configured for this deployment." }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const { previousSubjects = [] } = body;

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

    const result = await generateContent(env, 'text', payload);
    if (result.status >= 400) {
      console.error(`ft-ai ${result.status}: ${JSON.stringify(result.data).slice(0, 500)}`);
      return Response.json({ error: `Gemini via ft-ai returned HTTP ${result.status}` }, { status: 500 });
    }
    const parsed = jsonOf(result.data);
    if (parsed && parsed.subject) {
      return Response.json({ success: true, spark: parsed });
    }
    return Response.json({ error: "Failed to generate spark via Gemini" }, { status: 500 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
