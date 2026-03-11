import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const queue = await prisma.enrichmentQueueItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(queue);
}
