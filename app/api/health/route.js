import { healthResponse } from '../../../lib/ft-ai-health.mjs';
import { aiContext, aiEnv } from '../../../lib/ai';

export const runtime = 'edge';

// AI health for ft-tools/ai-audit.mjs: one tiny real call through FT_AI, cached 60 s.
export async function GET(request) {
  return healthResponse(request, aiEnv() ?? {}, aiContext());
}
