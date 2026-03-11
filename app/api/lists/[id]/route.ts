import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const list = await prisma.prospectList.findUnique({
    where: { id: params.id },
  });
  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(list);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const list = await prisma.prospectList.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(list);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.prospectList.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
