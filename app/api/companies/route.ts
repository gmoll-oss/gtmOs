import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(companies);
}
