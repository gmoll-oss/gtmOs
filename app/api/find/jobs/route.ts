import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const jobs = await prisma.searchJob.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(jobs);
}
