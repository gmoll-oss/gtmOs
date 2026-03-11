import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const identities = await prisma.identity.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(identities);
}
