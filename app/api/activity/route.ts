import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.activityItem.findMany({
    orderBy: { timestamp: "desc" },
  });
  return NextResponse.json(items);
}
