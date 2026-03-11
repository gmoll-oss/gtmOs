import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { leadId: string } }
) {
  const attempts = await prisma.enrichmentAttempt.findMany({
    where: { leadId: params.leadId },
    orderBy: { timestamp: "desc" },
  });
  return NextResponse.json(attempts);
}
