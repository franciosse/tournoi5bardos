import { isAdminAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { type Team, type Match } from "@prisma/client";
import Link from "next/link";
import PlanningGenerator from "@/components/PlanningGenerator";

type MatchWithTeams = Match & { team1: Team; team2: Team; refTeam: Team | null };
type PageData = { approvedCount: number; matches: MatchWithTeams[] };

async function getData(): Promise<PageData> {
  const [approvedCount, matches] = await Promise.all([
    prisma.team.count({ where: { status: "approved" } }),
    prisma.match.findMany({
      include: { team1: true, team2: true, refTeam: true },
      orderBy: [{ startTime: "asc" }, { field: "asc" }],
    }),
  ]);
  return { approvedCount, matches };
}

function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function groupByTime(matches: MatchWithTeams[]) {
  const groups: Record<string, MatchWithTeams[]> = {};
  matches.forEach((m: MatchWithTeams) => {
    const key = formatTime(m.startTime);
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
}

export default async function AdminPlanningPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { approvedCount, matches } = await getData().catch(
    (): PageData => ({ approvedCount: 0, matches: [] })
  );

  const groups = groupByTime(matches);
  const slots = Object.keys(groups).sort();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>
          ← Retour admin
        </Link>
        <h1 style={{ color: "#e8520a", fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, textTransform: "uppercase", margin: "0.5rem 0 0" }}>
          ✦ Planning
        </h1>
        <div className="basque-stripe" style={{ width: 80, marginTop: 8 }} />
      </div>

      <PlanningGenerator approvedCount={approvedCount} hasMatches={matches.length > 0} />

      {slots.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "#e8520a", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "1rem" }}>
            Planning actuel — {matches.length} matchs
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {slots.map((time) => (
              <div key={time}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.6rem" }}>
                  <span style={{ background: "#e8520a", color: "white", fontWeight: 700, fontFamily: "var(--font-display)", padding: "0.2rem 0.7rem", borderRadius: 4, minWidth: 60, textAlign: "center" }}>
                    {time}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "#333" }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groups[time].sort((a: MatchWithTeams, b: MatchWithTeams) => a.field - b.field).map((m: MatchWithTeams) => (
                    <div key={m.id} className="card" style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ fontSize: "0.75rem", color: "#555", marginBottom: "0.4rem" }}>
                        TERRAIN {m.field}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700, fontFamily: "var(--font-display)", color: "white", flex: 1 }}>{m.team1.name}</span>
                        <span style={{ color: "#555" }}>vs</span>
                        <span style={{ fontWeight: 700, fontFamily: "var(--font-display)", color: "white", flex: 1, textAlign: "right" }}>{m.team2.name}</span>
                      </div>
                      {m.refTeam && (
                        <div style={{ marginTop: "0.4rem", fontSize: "0.75rem", color: "#555" }}>
                          ⚖️ {m.refTeam.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
