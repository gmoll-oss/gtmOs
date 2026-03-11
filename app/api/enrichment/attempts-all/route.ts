import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const attempts = await prisma.enrichmentAttempt.findMany({
    orderBy: { timestamp: "desc" },
  });
  return NextResponse.json(attempts);
}
