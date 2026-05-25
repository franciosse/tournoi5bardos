import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateSchedule } from "@/lib/scheduler";

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        team1: true,
        team2: true,
        refTeam: true,
      },
      orderBy: [{ startTime: "asc" }, { field: "asc" }],
    });
    return NextResponse.json(matches);
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const tournamentDate = body.date ? new Date(body.date) : new Date();

    const teams = await prisma.team.findMany({
      where: { status: "approved" },
      select: { id: true },
    });

    if (teams.length < 2) {
      return NextResponse.json(
        { error: "Il faut au moins 2 équipes approuvées pour générer le planning." },
        { status: 400 }
      );
    }

    const teamIds = teams.map((t) => t.id);
    const schedule = generateSchedule(teamIds, 7, 2, tournamentDate);

    // Clear existing matches before regenerating
    await prisma.match.deleteMany();

    const matches = await prisma.match.createMany({
      data: schedule.map((m) => ({
        field: m.field,
        startTime: m.startTime,
        team1Id: m.team1Id,
        team2Id: m.team2Id,
        refTeamId: m.refTeamId,
        status: "scheduled",
      })),
    });

    return NextResponse.json({ created: matches.count });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
