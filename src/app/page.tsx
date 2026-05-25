import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getStats() {
  try {
    const [teamCount, matchCount] = await Promise.all([
      prisma.team.count({ where: { status: "approved" } }),
      prisma.match.count({ where: { status: "played" } }),
    ]);
    return { teamCount, matchCount };
  } catch {
    return { teamCount: 0, matchCount: 0 };
  }
}

export default async function HomePage() {
  const { teamCount, matchCount } = await getStats();

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
          borderBottom: "2px solid #e8520a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Basque geometric background pattern */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(232,82,10,0.04) 40px, rgba(232,82,10,0.04) 42px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "5rem 1.5rem",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
            <Image
              src="/logo.jpg"
              alt="US Bardos les 3 Vallées"
              width={120}
              height={120}
              style={{ borderRadius: 12, boxShadow: "0 0 40px rgba(232,82,10,0.4)" }}
              priority
            />
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              color: "white",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
              fontFamily: "var(--font-display)",
            }}
          >
            Tournoi Rugby à 5
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
              color: "#e8520a",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-display)",
            }}
          >
            Fêtes de Bardos — Bardozeko Festak
          </p>

          <div className="basque-stripe" style={{ width: 200, margin: "0 auto 2rem" }} />

          <p style={{ color: "#aaa", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
            Le tournoi de rugby à 5 des fêtes de Bardos — une compétition conviviale
            sur 2 terrains, de 10h à 12h30. Jusqu&apos;à 8 équipes de 10 joueurs.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/inscription" className="btn-primary" style={{ fontSize: "1rem" }}>
              Inscrire mon équipe
            </Link>
            <Link href="/programme" className="btn-secondary" style={{ fontSize: "1rem" }}>
              Voir le programme
            </Link>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section style={{ maxWidth: 1100, margin: "3rem auto", padding: "0 1.5rem" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🏉",
              title: "Rugby à 5",
              desc: "Matchs de 7 minutes, format dynamique. Chaque équipe joue contre toutes les autres (round-robin).",
            },
            {
              icon: "🏟️",
              title: "2 terrains",
              desc: "Les matchs se déroulent sur 2 terrains en simultané, de 10h à 12h30.",
            },
            {
              icon: "⚖️",
              title: "Arbitrage équitable",
              desc: "L'équipe qui ne joue pas fournit 2 arbitres. La rotation est gérée automatiquement.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{icon}</div>
              <h2
                style={{
                  color: "#e8520a",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  marginBottom: "0.5rem",
                  fontFamily: "var(--font-display)",
                }}
              >
                {title}
              </h2>
              <p style={{ color: "#aaa", lineHeight: 1.6, fontSize: "0.95rem" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto 3rem",
          padding: "0 1.5rem",
        }}
      >
        <div
          className="card"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            gap: "2rem",
            padding: "2rem",
          }}
        >
          {[
            { value: teamCount, max: 8, label: "Équipes inscrites" },
            { value: matchCount, label: "Matchs joués" },
            { value: "7 min", label: "Durée par match" },
            { value: "10h–12h30", label: "Horaire du tournoi" },
          ].map(({ value, max, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 900,
                  color: "#e8520a",
                  fontFamily: "var(--font-display)",
                }}
              >
                {typeof value === "number" && max !== undefined
                  ? `${value}/${max}`
                  : value}
              </div>
              <div style={{ color: "#888", fontSize: "0.85rem", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA inscription */}
      <section
        style={{
          background: "linear-gradient(90deg, #1a0800 0%, #2a1000 50%, #1a0800 100%)",
          borderTop: "1px solid #333",
          borderBottom: "1px solid #333",
          padding: "3rem 1.5rem",
          textAlign: "center",
        }}
      >
        <span style={{ color: "#e8520a", fontSize: "1.5rem" }}>✦</span>
        <h2
          style={{
            color: "white",
            fontSize: "1.6rem",
            fontWeight: 700,
            margin: "0.5rem 0",
            fontFamily: "var(--font-display)",
          }}
        >
          Prêt à participer ?
        </h2>
        <p style={{ color: "#aaa", marginBottom: "1.5rem" }}>
          Les inscriptions sont ouvertes. Maximum 8 équipes, 10 joueurs par équipe.
        </p>
        <Link href="/inscription" className="btn-primary">
          S&apos;inscrire maintenant
        </Link>
      </section>
    </>
  );
}
