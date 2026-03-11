import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const playbook = await prisma.aIPlaybook.findFirst();
  if (!playbook) return NextResponse.json(null);
  return NextResponse.json(playbook);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const existing = await prisma.aIPlaybook.findFirst();
  if (!existing) {
    const created = await prisma.aIPlaybook.create({ data: body });
    return NextResponse.json(created);
  }
  const updated = await prisma.aIPlaybook.update({
    where: { id: existing.id },
    data: body,
  });
  return NextResponse.json(updated);
}
