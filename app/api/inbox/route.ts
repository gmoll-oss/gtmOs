import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const threads = await prisma.inboxThread.findMany({
    include: { messages: { orderBy: { timestamp: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(threads);
}
