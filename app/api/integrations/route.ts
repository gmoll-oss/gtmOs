import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    zoho: { connected: false, lastSync: null },
    pms: { connected: false },
    zapier: { connected: false },
    webhooks: { configured: false },
  });
}
