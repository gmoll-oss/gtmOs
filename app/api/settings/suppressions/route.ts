import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const suppressions = await prisma.suppressionEntry.findMany({
    orderBy: { addedAt: "desc" },
  });
  return NextResponse.json(suppressions);
}
