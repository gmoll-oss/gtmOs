import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      enrichmentAttempts: { orderBy: { timestamp: "desc" } },
      eventLogs: { orderBy: { timestamp: "desc" } },
      enrichmentQueue: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(lead);
}
