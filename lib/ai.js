import { getRequestContext } from '@cloudflare/next-on-pages';

// Gemini goes through the shared ft-ai gateway (dev-projects/ft-ai), which owns
// model choice, retries and fallback — nothing in stitchbox names a model.
// On Cloudflare the gateway is the FT_AI service binding; `next dev` (no
// bindings) can reach it over HTTP with FT_AI_KEY in .env.local.
export function aiEnv() {
  try {
    const { env } = getRequestContext();
    if (env?.FT_AI || env?.FT_AI_KEY) return env;
  } catch {
    // getRequestContext throws outside the Cloudflare runtime (plain `next dev`).
  }
  if (process.env.FT_AI_KEY) return { FT_AI_KEY: process.env.FT_AI_KEY, FT_AI_URL: process.env.FT_AI_URL };
  return null;
}

export function aiContext() {
  try {
    return getRequestContext().ctx;
  } catch {
    return undefined;
  }
}
