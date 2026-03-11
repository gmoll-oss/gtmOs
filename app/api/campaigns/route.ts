import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    include: { steps: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(campaigns);
}
