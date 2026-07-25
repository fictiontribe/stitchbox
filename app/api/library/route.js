import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// Memory store for sharing uploaded assets across edge calls when KV binding is not attached
let sharedMemoryLibrary = [];

export async function GET() {
  try {
    let kv;
    try {
      const ctx = getRequestContext();
      kv = ctx?.env?.STITCHBOX_KV;
    } catch (e) {}

    if (kv) {
      const stored = await kv.get('shared_library', 'json');
      if (stored && Array.isArray(stored)) {
        return Response.json({ success: true, items: stored });
      }
    }

    return Response.json({ success: true, items: sharedMemoryLibrary });
  } catch (err) {
    return Response.json({ success: true, items: sharedMemoryLibrary });
  }
}

export async function POST(request) {
  try {
    const item = await request.json();
    if (!item || !item.id) {
      return Response.json({ error: "Invalid item payload" }, { status: 400 });
    }

    let kv;
    try {
      const ctx = getRequestContext();
      kv = ctx?.env?.STITCHBOX_KV;
    } catch (e) {}

    if (kv) {
      let stored = (await kv.get('shared_library', 'json')) || [];
      stored = [item, ...stored.filter(i => i.id !== item.id)];
      await kv.put('shared_library', JSON.stringify(stored));
      return Response.json({ success: true, items: stored });
    } else {
      sharedMemoryLibrary = [item, ...sharedMemoryLibrary.filter(i => i.id !== item.id)];
      return Response.json({ success: true, items: sharedMemoryLibrary });
    }
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    let kv;
    try {
      const ctx = getRequestContext();
      kv = ctx?.env?.STITCHBOX_KV;
    } catch (e) {}

    if (kv) {
      let stored = (await kv.get('shared_library', 'json')) || [];
      stored = stored.filter(i => i.id !== id);
      await kv.put('shared_library', JSON.stringify(stored));
      return Response.json({ success: true, items: stored });
    } else {
      sharedMemoryLibrary = sharedMemoryLibrary.filter(i => i.id !== id);
      return Response.json({ success: true, items: sharedMemoryLibrary });
    }
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
