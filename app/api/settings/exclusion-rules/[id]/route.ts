import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const rule = await prisma.exclusionRule.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(rule);
}
