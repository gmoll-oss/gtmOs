import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const lists = await prisma.prospectList.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(lists);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const list = await prisma.prospectList.create({ data: body });
  return NextResponse.json(list, { status: 201 });
}
