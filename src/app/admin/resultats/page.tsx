import { isAdminAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ScoreForm from "@/components/ScoreForm";

async function getMatches() {
  return prisma.match.findMany({
    include: { team1: true, team2: true },
    orderBy: [{ startTime: "asc" }, { field: "asc" }],
  });
}

function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default async function AdminResultatsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const matches = await getMatches().catch(() => []);

  const pending = matches.filter((m) => m.status !== "played");
  const played = matches.filter((m) => m.status === "played");

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>
          ← Retour admin
        </Link>
        <h1 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 900, textTransform: "uppercase", margin: "0.5rem 0 0" }}>
          ✦ Saisie des résultats
        </h1>
        <div className="basque-stripe" style={{ width: 80, marginTop: 8 }} />
      </div>

      {matches.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "#888" }}>Générez d&apos;abord le planning dans l&apos;onglet Planning.</p>
          <Link href="/admin/planning" style={{ color: "#e8520a", marginTop: "0.5rem", display: "inline-block" }}>
            Aller au planning →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Pending matches */}
          {pending.length > 0 && (
            <div>
              <h2 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontWeight: 700, marginBottom: "1rem" }}>
                Matchs à saisir ({pending.length})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {pending.map((m) => (
                  <div key={m.id} className="card">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                      <div style={{ minWidth: 90 }}>
                        <div style={{ fontSize: "0.75rem", color: "#555" }}>Terrain {m.field}</div>
                        <div style={{ fontWeight: 700, color: "#888", fontFamily: "Georgia, serif" }}>{formatTime(m.startTime)}</div>
                      </div>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, color: "white", fontFamily: "Georgia, serif", flex: 1 }}>{m.team1.name}</span>
                        <ScoreForm matchId={m.id} score1={m.score1} score2={m.score2} />
                        <span style={{ fontWeight: 700, color: "white", fontFamily: "Georgia, serif", flex: 1, textAlign: "right" }}>{m.team2.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Played matches */}
          {played.length > 0 && (
            <div>
              <h2 style={{ color: "#4caf50", fontFamily: "Georgia, serif", fontWeight: 700, marginBottom: "1rem" }}>
                Matchs saisis ({played.length})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {played.map((m) => (
                  <div key={m.id} className="card" style={{ opacity: 0.8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                      <div style={{ minWidth: 90 }}>
                        <div style={{ fontSize: "0.75rem", color: "#555" }}>Terrain {m.field}</div>
                        <div style={{ fontWeight: 700, color: "#888", fontFamily: "Georgia, serif" }}>{formatTime(m.startTime)}</div>
                      </div>
                      <span style={{ fontWeight: 700, color: "white", fontFamily: "Georgia, serif", flex: 1 }}>{m.team1.name}</span>
                      <span style={{ background: "#1a1a1a", border: "1px solid #e8520a", padding: "0.15rem 0.75rem", borderRadius: 4, fontWeight: 900, color: "#e8520a", whiteSpace: "nowrap" }}>
                        {m.score1} – {m.score2}
                      </span>
                      <span style={{ fontWeight: 700, color: "white", fontFamily: "Georgia, serif", flex: 1, textAlign: "right" }}>{m.team2.name}</span>
                      <ScoreForm matchId={m.id} score1={m.score1} score2={m.score2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
