import { isAdminAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { type Team, type Player } from "@prisma/client";
import Link from "next/link";
import TeamActions from "@/components/TeamActions";

type TeamWithPlayers = Team & { players: Player[] };

async function getTeams(): Promise<TeamWithPlayers[]> {
  return prisma.team.findMany({
    include: { players: true },
    orderBy: { createdAt: "asc" },
  });
}

export default async function AdminEquipesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const teams = await getTeams().catch((): TeamWithPlayers[] => []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>
          ← Retour admin
        </Link>
        <h1 style={{ color: "#e8520a", fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, textTransform: "uppercase", margin: "0.5rem 0 0" }}>
          ✦ Gestion des équipes
        </h1>
        <div className="basque-stripe" style={{ width: 80, marginTop: 8 }} />
      </div>

      {teams.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "#888" }}>Aucune équipe inscrite pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {teams.map((team: TeamWithPlayers) => (
            <div key={team.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                    <h2 style={{ color: "white", fontFamily: "var(--font-display)", fontWeight: 700, margin: 0 }}>
                      {team.name}
                    </h2>
                    <span className={`badge-${team.status}`}>
                      {team.status === "pending" ? "En attente" : team.status === "approved" ? "Validée" : "Refusée"}
                    </span>
                  </div>
                  <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>
                    📧 {team.contactEmail} · 👤 {team.contactName}
                    {team.contactPhone && ` · 📞 ${team.contactPhone}`}
                  </p>
                  <details>
                    <summary style={{ color: "#e8520a", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                      {team.players.length} joueur(s)
                    </summary>
                    <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {team.players.map((p: Player) => (
                        <span
                          key={p.id}
                          style={{
                            background: "#222",
                            border: "1px solid #333",
                            borderRadius: 4,
                            padding: "0.2rem 0.6rem",
                            fontSize: "0.8rem",
                            color: "#ccc",
                          }}
                        >
                          {p.number ? `#${p.number} ` : ""}{p.name}
                        </span>
                      ))}
                    </div>
                  </details>
                </div>
                <TeamActions teamId={team.id} currentStatus={team.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
