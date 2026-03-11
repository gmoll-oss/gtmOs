import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [leads, campaigns, companies, identities] = await Promise.all([
    prisma.lead.findMany(),
    prisma.campaign.findMany({ include: { steps: true } }),
    prisma.company.findMany(),
    prisma.identity.findMany(),
  ]);

  const totalLeads = leads.length;
  const totalCompanies = companies.length;
  const totalSent = campaigns.reduce((s, c) => s + c.totalSent, 0);
  const totalOpened = campaigns.reduce((s, c) => s + c.totalOpened, 0);
  const totalReplied = campaigns.reduce((s, c) => s + c.totalReplied, 0);
  const totalBounced = campaigns.reduce((s, c) => s + c.totalBounced, 0);

  const pipelineCounts: Record<string, number> = {};
  for (const lead of leads) {
    pipelineCounts[lead.status] = (pipelineCounts[lead.status] || 0) + 1;
  }

  return NextResponse.json({
    totalLeads,
    totalCompanies,
    totalSent,
    totalOpened,
    totalReplied,
    totalBounced,
    openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
    replyRate: totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0,
    bounceRate: totalSent > 0 ? Math.round((totalBounced / totalSent) * 100) : 0,
    pipelineCounts,
    campaigns: campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      enrolledCount: c.enrolledCount,
      totalSent: c.totalSent,
      totalOpened: c.totalOpened,
      totalReplied: c.totalReplied,
      totalBounced: c.totalBounced,
    })),
    identities: identities.map((i) => ({
      id: i.id,
      name: i.name,
      sentToday: i.sentToday,
      dailyLimit: i.dailyLimit,
    })),
  });
}
