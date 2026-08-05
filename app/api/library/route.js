import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

function getKvBinding() {
  try {
    const ctx = getRequestContext();
    if (ctx && ctx.env && ctx.env.STITCHBOX_KV) {
      return ctx.env.STITCHBOX_KV;
    }
  } catch (e) {}

  if (typeof STITCHBOX_KV !== 'undefined') {
    return STITCHBOX_KV;
  }
  return process.env.STITCHBOX_KV;
}

export async function GET() {
  try {
    const kv = getKvBinding();
    if (kv) {
      const stored = await kv.get('shared_library', 'json');
      if (stored && Array.isArray(stored)) {
        return Response.json({ success: true, items: stored });
      }
    }
    return Response.json({ success: true, items: [] });
  } catch (err) {
    console.error("GET /api/library error:", err);
    return Response.json({ success: false, items: [], error: err.message });
  }
}

export async function POST(request) {
  try {
    const item = await request.json();
    if (!item || !item.id) {
      return Response.json({ error: "Invalid item payload" }, { status: 400 });
    }

    const kv = getKvBinding();
    if (kv) {
      let stored = (await kv.get('shared_library', 'json')) || [];
      stored = [item, ...stored.filter(i => i.id !== item.id)];
      // Keep up to 250 latest shared board items in persistent Cloudflare KV
      if (stored.length > 250) stored = stored.slice(0, 250);
      await kv.put('shared_library', JSON.stringify(stored));
      return Response.json({ success: true, items: stored });
    }

    return Response.json({ error: "Cloudflare KV storage binding STITCHBOX_KV not available" }, { status: 500 });
  } catch (err) {
    console.error("POST /api/library error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    let expectedPasscode = process.env.ADMIN_PASSCODE;
    try {
      const ctx = getRequestContext();
      if (ctx?.env?.ADMIN_PASSCODE) {
        expectedPasscode = ctx.env.ADMIN_PASSCODE;
      }
    } catch (e) {}

    if (!expectedPasscode) expectedPasscode = 'stitchbox2026';

    const providedPasscode = request.headers.get('x-admin-passcode') || request.headers.get('x-passcode');
    if (providedPasscode !== expectedPasscode) {
      return Response.json({ error: "Unauthorized: Invalid admin passcode" }, { status: 401 });
    }

    const { id } = await request.json();
    const kv = getKvBinding();
    if (kv) {
      let stored = (await kv.get('shared_library', 'json')) || [];
      stored = stored.filter(i => String(i.id) !== String(id));
      await kv.put('shared_library', JSON.stringify(stored));
      return Response.json({ success: true, items: stored });
    }
    return Response.json({ error: "Cloudflare KV storage binding STITCHBOX_KV not available" }, { status: 500 });
  } catch (err) {
    console.error("DELETE /api/library error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
