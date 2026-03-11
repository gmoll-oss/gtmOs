import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const rules = await prisma.exclusionRule.findMany();
  return NextResponse.json(rules);
}
