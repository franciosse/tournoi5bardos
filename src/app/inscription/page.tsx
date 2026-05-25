"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Player {
  name: string;
  number: string;
}

export default function InscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [teamName, setTeamName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [players, setPlayers] = useState<Player[]>([{ name: "", number: "" }]);

  function addPlayer() {
    if (players.length < 10) setPlayers([...players, { name: "", number: "" }]);
  }

  function removePlayer(i: number) {
    if (players.length > 1) setPlayers(players.filter((_, idx) => idx !== i));
  }

  function updatePlayer(i: number, field: keyof Player, value: string) {
    setPlayers(players.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          contactName,
          contactEmail,
          contactPhone: contactPhone || undefined,
          players: players
            .filter((p) => p.name.trim())
            .map((p) => ({
              name: p.name.trim(),
              number: p.number ? parseInt(p.number) : undefined,
            })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'inscription.");
      } else {
        setStep("success");
      }
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div style={{ maxWidth: 600, margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏉</div>
        <h1 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontSize: "2rem", marginBottom: "0.5rem" }}>
          Inscription envoyée !
        </h1>
        <div className="basque-stripe" style={{ width: 120, margin: "1rem auto" }} />
        <p style={{ color: "#aaa", marginBottom: "2rem", lineHeight: 1.7 }}>
          Votre demande d&apos;inscription a bien été reçue. Un administrateur va la valider prochainement.
          Vous serez contacté à l&apos;adresse indiquée.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="btn-primary" onClick={() => { setStep("form"); setTeamName(""); setContactName(""); setContactEmail(""); setContactPhone(""); setPlayers([{ name: "", number: "" }]); }}>
            Nouvelle inscription
          </button>
          <button className="btn-secondary" onClick={() => router.push("/programme")}>
            Voir le programme
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 900, textTransform: "uppercase" }}>
          ✦ Inscription
        </h1>
        <div className="basque-stripe" style={{ width: 80, marginTop: 8 }} />
        <p style={{ color: "#aaa", marginTop: "0.75rem" }}>
          Inscrivez votre équipe au tournoi de rugby à 5 des fêtes de Bardos. Maximum 8 équipes, 10 joueurs par équipe.
        </p>
      </div>

      {error && (
        <div style={{ background: "#2a0a0a", border: "1px solid #8a1a1a", borderRadius: 6, padding: "0.75rem 1rem", color: "#f44336", marginBottom: "1.5rem" }}>
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Team info */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontWeight: 700, marginBottom: "1rem" }}>
            Informations de l&apos;équipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={{ display: "block", color: "#bbb", marginBottom: 4, fontSize: "0.9rem" }}>
                Nom de l&apos;équipe *
              </label>
              <input
                className="input-field"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Les Bascos du Bas..."
                maxLength={80}
              />
            </div>
            <div>
              <label style={{ display: "block", color: "#bbb", marginBottom: 4, fontSize: "0.9rem" }}>
                Nom du responsable *
              </label>
              <input
                className="input-field"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Prénom Nom"
                maxLength={80}
              />
            </div>
            <div>
              <label style={{ display: "block", color: "#bbb", marginBottom: 4, fontSize: "0.9rem" }}>
                Email *
              </label>
              <input
                className="input-field"
                required
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@equipe.fr"
              />
            </div>
            <div>
              <label style={{ display: "block", color: "#bbb", marginBottom: 4, fontSize: "0.9rem" }}>
                Téléphone
              </label>
              <input
                className="input-field"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                maxLength={20}
              />
            </div>
          </div>
        </div>

        {/* Players */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontWeight: 700 }}>
              Joueurs ({players.length}/10)
            </h2>
            {players.length < 10 && (
              <button type="button" className="btn-secondary" style={{ padding: "0.3rem 0.8rem", fontSize: "0.85rem" }} onClick={addPlayer}>
                + Ajouter
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {players.map((player, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span style={{ color: "#666", minWidth: 24, textAlign: "right", fontSize: "0.9rem" }}>{i + 1}.</span>
                <input
                  className="input-field"
                  style={{ flex: 3 }}
                  required
                  placeholder="Prénom Nom"
                  value={player.name}
                  onChange={(e) => updatePlayer(i, "name", e.target.value)}
                  maxLength={80}
                />
                <input
                  className="input-field"
                  style={{ flex: 1, maxWidth: 80 }}
                  type="number"
                  placeholder="N°"
                  min={1}
                  max={99}
                  value={player.number}
                  onChange={(e) => updatePlayer(i, "number", e.target.value)}
                />
                {players.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePlayer(i)}
                    style={{ color: "#666", background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }}
                    aria-label="Supprimer"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "0.75rem", fontSize: "1rem" }} disabled={loading}>
          {loading ? "Envoi en cours…" : "Envoyer l'inscription ✦"}
        </button>
      </form>
    </div>
  );
}
