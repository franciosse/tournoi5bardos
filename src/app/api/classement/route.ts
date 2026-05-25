import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      where: { status: "approved" },
      select: { id: true, name: true },
    });

    const playedMatches = await prisma.match.findMany({
      where: { status: "played" },
    });

    const stats: Record<
      number,
      {
        id: number;
        name: string;
        played: number;
        won: number;
        drawn: number;
        lost: number;
        points: number;
        scored: number;
        conceded: number;
      }
    > = {};

    teams.forEach((t) => {
      stats[t.id] = {
        id: t.id,
        name: t.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        points: 0,
        scored: 0,
        conceded: 0,
      };
    });

    playedMatches.forEach((m) => {
      const s1 = m.score1 ?? 0;
      const s2 = m.score2 ?? 0;
      const t1 = stats[m.team1Id];
      const t2 = stats[m.team2Id];
      if (!t1 || !t2) return;

      t1.played++;
      t2.played++;
      t1.scored += s1;
      t1.conceded += s2;
      t2.scored += s2;
      t2.conceded += s1;

      if (s1 > s2) {
        t1.won++;
        t1.points += 3;
        t2.lost++;
      } else if (s2 > s1) {
        t2.won++;
        t2.points += 3;
        t1.lost++;
      } else {
        t1.drawn++;
        t2.drawn++;
        t1.points += 1;
        t2.points += 1;
      }
    });

    const sorted = Object.values(stats).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.scored - a.conceded;
      const diffB = b.scored - b.conceded;
      if (diffB !== diffA) return diffB - diffA;
      return b.scored - a.scored;
    });

    return NextResponse.json(sorted);
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
