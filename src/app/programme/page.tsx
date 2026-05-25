import { prisma } from "@/lib/prisma";
import { type Team, type Match } from "@prisma/client";

type MatchWithTeams = Match & { team1: Team; team2: Team; refTeam: Team | null };

async function getMatches(): Promise<MatchWithTeams[]> {
  try {
    return await prisma.match.findMany({
      include: { team1: true, team2: true, refTeam: true },
      orderBy: [{ startTime: "asc" }, { field: "asc" }],
    });
  } catch {
    return [];
  }
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

export default async function ProgrammePage() {
  const matches = await getMatches();
  const groups = groupByTime(matches);
  const slots = Object.keys(groups).sort();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 900, textTransform: "uppercase" }}>
          ✦ Programme
        </h1>
        <div className="basque-stripe" style={{ width: 80, marginTop: 8 }} />
        <p style={{ color: "#aaa", marginTop: "0.75rem" }}>
          Planning des matchs — 2 terrains · 10h00 à 12h30 · Matchs de 7 minutes
        </p>
      </div>

      {slots.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗓️</div>
          <p style={{ color: "#888" }}>Le planning n&apos;a pas encore été publié.</p>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Il sera disponible dès la clôture des inscriptions.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {slots.map((time) => (
            <div key={time}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                <span
                  style={{
                    background: "#e8520a",
                    color: "white",
                    fontWeight: 700,
                    fontFamily: "Georgia, serif",
                    padding: "0.25rem 0.75rem",
                    borderRadius: 4,
                    fontSize: "1.05rem",
                    minWidth: 70,
                    textAlign: "center",
                  }}
                >
                  {time}
                </span>
                <div style={{ flex: 1, height: 1, background: "#333" }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups[time]
                  .sort((a: MatchWithTeams, b: MatchWithTeams) => a.field - b.field)
                  .map((match: MatchWithTeams) => (
                    <div
                      key={match.id}
                      className="card"
                      style={{
                        border: match.status === "played" ? "1px solid #3a3a1a" : "1px solid #333",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 12,
                          fontSize: "0.75rem",
                          color: "#666",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                        }}
                      >
                        TERRAIN {match.field}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.5rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        <span style={{ fontWeight: 700, fontFamily: "Georgia, serif", color: "white", flex: 1 }}>
                          {match.team1.name}
                        </span>

                        {match.status === "played" ? (
                          <span
                            style={{
                              background: "#1a1a1a",
                              border: "1px solid #e8520a",
                              borderRadius: 4,
                              padding: "0.2rem 0.75rem",
                              fontWeight: 900,
                              fontFamily: "Georgia, serif",
                              color: "#e8520a",
                              fontSize: "1.1rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {match.score1} – {match.score2}
                          </span>
                        ) : (
                          <span style={{ color: "#555", fontWeight: 700, padding: "0 0.5rem" }}>vs</span>
                        )}

                        <span style={{ fontWeight: 700, fontFamily: "Georgia, serif", color: "white", flex: 1, textAlign: "right" }}>
                          {match.team2.name}
                        </span>
                      </div>

                      {match.refTeam && (
                        <div
                          style={{
                            marginTop: "0.6rem",
                            paddingTop: "0.6rem",
                            borderTop: "1px solid #2a2a2a",
                            fontSize: "0.8rem",
                            color: "#666",
                          }}
                        >
                          ⚖️ Arbitres : <span style={{ color: "#888" }}>{match.refTeam.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
