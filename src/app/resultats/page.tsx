import { prisma } from "@/lib/prisma";
import { type Team, type Match } from "@prisma/client";

type TeamStat = {
  id: number;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  scored: number;
  conceded: number;
};

type MatchWithTeams = Match & { team1: Team; team2: Team };

async function getStandings(): Promise<TeamStat[]> {
  const teams = await prisma.team.findMany({
    where: { status: "approved" },
    select: { id: true, name: true },
  });

  const playedMatches = await prisma.match.findMany({ where: { status: "played" } });

  const stats: Record<number, TeamStat> = {};

  teams.forEach((t: { id: number; name: string }) => {
    stats[t.id] = { id: t.id, name: t.name, played: 0, won: 0, drawn: 0, lost: 0, points: 0, scored: 0, conceded: 0 };
  });

  playedMatches.forEach((m: Match) => {
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
    if (s1 > s2) { t1.won++; t1.points += 3; t2.lost++; }
    else if (s2 > s1) { t2.won++; t2.points += 3; t1.lost++; }
    else { t1.drawn++; t2.drawn++; t1.points++; t2.points++; }
  });

  return Object.values(stats).sort((a: TeamStat, b: TeamStat) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffA = a.scored - a.conceded;
    const diffB = b.scored - b.conceded;
    if (diffB !== diffA) return diffB - diffA;
    return b.scored - a.scored;
  });
}

async function getRecentMatches(): Promise<MatchWithTeams[]> {
  try {
    return await prisma.match.findMany({
      where: { status: "played" },
      include: { team1: true, team2: true },
      orderBy: { startTime: "asc" },
    });
  } catch {
    return [];
  }
}

function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function ResultatsPage() {
  const [standings, matches] = await Promise.all([
    getStandings().catch((): TeamStat[] => []),
    getRecentMatches(),
  ]);

  const hasResults = matches.length > 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 900, textTransform: "uppercase" }}>
          ✦ Résultats & Classement
        </h1>
        <div className="basque-stripe" style={{ width: 80, marginTop: 8 }} />
      </div>

      {!hasResults ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
          <p style={{ color: "#888" }}>Les résultats seront affichés dès le début du tournoi.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #2a2a2a" }}>
              <h2 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontWeight: 700, margin: 0 }}>
                Classement général
              </h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="table-basque">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Équipe</th>
                    <th style={{ textAlign: "center" }}>J</th>
                    <th style={{ textAlign: "center" }}>G</th>
                    <th style={{ textAlign: "center" }}>N</th>
                    <th style={{ textAlign: "center" }}>P</th>
                    <th style={{ textAlign: "center" }}>+/-</th>
                    <th style={{ textAlign: "center", color: "#ffd700" }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team: TeamStat, i: number) => (
                    <tr key={team.id} style={i < 3 ? { background: "rgba(232,82,10,0.05)" } : {}}>
                      <td style={{ textAlign: "center", fontSize: "1.1rem" }}>{MEDALS[i] ?? i + 1}</td>
                      <td style={{ fontWeight: 700, color: "white", fontFamily: "Georgia, serif" }}>{team.name}</td>
                      <td style={{ textAlign: "center", color: "#aaa" }}>{team.played}</td>
                      <td style={{ textAlign: "center", color: "#4caf50" }}>{team.won}</td>
                      <td style={{ textAlign: "center", color: "#aaa" }}>{team.drawn}</td>
                      <td style={{ textAlign: "center", color: "#f44336" }}>{team.lost}</td>
                      <td style={{ textAlign: "center", color: team.scored - team.conceded >= 0 ? "#4caf50" : "#f44336" }}>
                        {team.scored - team.conceded > 0 ? "+" : ""}{team.scored - team.conceded}
                      </td>
                      <td style={{ textAlign: "center", fontWeight: 900, color: "#e8520a", fontSize: "1.1rem" }}>{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "0.5rem 1rem", borderTop: "1px solid #222" }}>
              <p style={{ color: "#555", fontSize: "0.75rem", margin: 0 }}>
                Points : Victoire = 3 pts · Nul = 1 pt · Défaite = 0 pt
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #2a2a2a" }}>
              <h2 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontWeight: 700, margin: 0 }}>
                Résultats des matchs
              </h2>
            </div>
            <div style={{ padding: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {matches.map((m: MatchWithTeams) => (
                  <div
                    key={m.id}
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.75rem", borderRadius: 6, background: "#111" }}
                  >
                    <span style={{ color: "#555", fontSize: "0.8rem", minWidth: 42 }}>{formatTime(m.startTime)}</span>
                    <span style={{ color: "#666", fontSize: "0.75rem", minWidth: 60 }}>Terrain {m.field}</span>
                    <span style={{ flex: 1, textAlign: "right", fontWeight: 700, color: (m.score1 ?? 0) > (m.score2 ?? 0) ? "white" : "#888" }}>
                      {m.team1.name}
                    </span>
                    <span style={{ background: "#1a1a1a", border: "1px solid #e8520a", padding: "0.15rem 0.6rem", borderRadius: 4, fontWeight: 900, color: "#e8520a", whiteSpace: "nowrap", fontSize: "0.95rem" }}>
                      {m.score1} – {m.score2}
                    </span>
                    <span style={{ flex: 1, fontWeight: 700, color: (m.score2 ?? 0) > (m.score1 ?? 0) ? "white" : "#888" }}>
                      {m.team2.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
