"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanningGenerator({
  approvedCount,
  hasMatches,
}: {
  approvedCount: number;
  hasMatches: boolean;
}) {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function generate() {
    if (hasMatches && !confirm("Cela va supprimer le planning actuel et en générer un nouveau. Confirmer ?")) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la génération.");
      } else {
        setSuccess(`Planning généré avec succès : ${data.created} matchs créés.`);
        router.refresh();
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 style={{ color: "#e8520a", fontFamily: "Georgia, serif", fontWeight: 700, marginBottom: "1rem" }}>
        Générer le planning
      </h2>

      {approvedCount < 2 && (
        <div style={{ background: "#1a1000", border: "1px solid #5a3a00", borderRadius: 6, padding: "0.75rem 1rem", color: "#ffd700", marginBottom: "1rem", fontSize: "0.9rem" }}>
          ⚠ Il faut au moins 2 équipes validées pour générer le planning. ({approvedCount} actuellement)
        </div>
      )}

      {error && (
        <div style={{ background: "#2a0a0a", border: "1px solid #8a1a1a", borderRadius: 6, padding: "0.75rem 1rem", color: "#f44336", marginBottom: "1rem" }}>
          ⚠ {error}
        </div>
      )}

      {success && (
        <div style={{ background: "#0a2a0a", border: "1px solid #1a8a1a", borderRadius: 6, padding: "0.75rem 1rem", color: "#4caf50", marginBottom: "1rem" }}>
          ✓ {success}
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ display: "block", color: "#bbb", marginBottom: 4, fontSize: "0.9rem" }}>
            Date du tournoi
          </label>
          <input
            className="input-field"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button
          className="btn-primary"
          onClick={generate}
          disabled={loading || approvedCount < 2}
          style={{ whiteSpace: "nowrap" }}
        >
          {loading ? "Génération…" : hasMatches ? "Régénérer le planning" : "Générer le planning"}
        </button>
      </div>

      <p style={{ color: "#555", fontSize: "0.8rem", marginTop: "0.75rem" }}>
        Round-robin complet · 2 terrains · 10h00–12h30 · 7 min/match · rotation arbitres automatique
      </p>
    </div>
  );
}
