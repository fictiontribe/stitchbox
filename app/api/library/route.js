import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

function getKvBinding() {
  try {
    const ctx = getRequestContext();
    return ctx?.env?.STITCHBOX_KV || process.env.STITCHBOX_KV;
  } catch (e) {
    return process.env.STITCHBOX_KV;
  }
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
      // Keep up to 50 latest shared board items in persistent Cloudflare KV
      if (stored.length > 50) stored = stored.slice(0, 50);
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
    const { id } = await request.json();
    const kv = getKvBinding();
    if (kv) {
      let stored = (await kv.get('shared_library', 'json')) || [];
      stored = stored.filter(i => i.id !== id);
      await kv.put('shared_library', JSON.stringify(stored));
      return Response.json({ success: true, items: stored });
    }
    return Response.json({ error: "Cloudflare KV storage binding STITCHBOX_KV not available" }, { status: 500 });
  } catch (err) {
    console.error("DELETE /api/library error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
