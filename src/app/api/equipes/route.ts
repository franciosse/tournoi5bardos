import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: { players: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(teams);
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
