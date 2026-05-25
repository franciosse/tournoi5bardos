import { isAdminAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminLogout from "@/components/AdminLogout";

async function getStats() {
  const [pending, approved, matchCount, played] = await Promise.all([
    prisma.team.count({ where: { status: "pending" } }),
    prisma.team.count({ where: { status: "approved" } }),
    prisma.match.count(),
    prisma.match.count({ where: { status: "played" } }),
  ]);
  return { pending, approved, matchCount, played };
}

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const stats = await getStats().catch(() => ({ pending: 0, approved: 0, matchCount: 0, played: 0 }));

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 900, textTransform: "uppercase", margin: 0 }}>
            ✦ Administration
          </h1>
          <div className="basque-stripe" style={{ width: 80, marginTop: 8 }} />
        </div>
        <AdminLogout />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { value: stats.pending, label: "En attente", color: "#ffd700" },
          { value: `${stats.approved}/8`, label: "Équipes validées", color: "#4caf50" },
          { value: stats.matchCount, label: "Matchs générés", color: "#e8520a" },
          { value: `${stats.played}/${stats.matchCount}`, label: "Matchs joués", color: "#aaa" },
        ].map(({ value, label, color }) => (
          <div key={label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color, fontFamily: "Georgia, serif" }}>{value}</div>
            <div style={{ color: "#666", fontSize: "0.8rem", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            href: "/admin/equipes",
            icon: "👥",
            title: "Équipes",
            desc: "Valider ou refuser les inscriptions, consulter les joueurs.",
            badge: stats.pending > 0 ? `${stats.pending} en attente` : null,
          },
          {
            href: "/admin/planning",
            icon: "🗓️",
            title: "Planning",
            desc: "Générer le planning round-robin avec rotation automatique des arbitres.",
            badge: stats.matchCount > 0 ? `${stats.matchCount} matchs` : null,
          },
          {
            href: "/admin/resultats",
            icon: "🏆",
            title: "Résultats",
            desc: "Saisir les scores des matchs joués.",
            badge: stats.played > 0 ? `${stats.played} saisis` : null,
          },
        ].map(({ href, icon, title, desc, badge }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div
              className="card"
              style={{
                cursor: "pointer",
                transition: "border-color 0.2s",
                height: "100%",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e8520a")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#333")}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <h2 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontWeight: 700, margin: 0 }}>{title}</h2>
                {badge && <span className="badge-pending">{badge}</span>}
              </div>
              <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: 1.5, margin: 0 }}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
