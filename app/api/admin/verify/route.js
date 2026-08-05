import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { passcode } = await request.json();
    let expectedPasscode = process.env.ADMIN_PASSCODE;

    try {
      const ctx = getRequestContext();
      if (ctx?.env?.ADMIN_PASSCODE) {
        expectedPasscode = ctx.env.ADMIN_PASSCODE;
      }
    } catch (e) {}

    if (!expectedPasscode) {
      expectedPasscode = 'stitchbox2026';
    }

    if (passcode === expectedPasscode) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, error: "Incorrect passcode" }, { status: 401 });
    }
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
