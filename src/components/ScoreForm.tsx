"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScoreForm({
  matchId,
  score1,
  score2,
}: {
  matchId: number;
  score1: number | null;
  score2: number | null;
}) {
  const router = useRouter();
  const [s1, setS1] = useState(score1?.toString() ?? "");
  const [s2, setS2] = useState(score2?.toString() ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    if (s1 === "" || s2 === "") return;
    setLoading(true);
    await fetch(`/api/matchs/${matchId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score1: parseInt(s1), score2: parseInt(s2) }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      <input
        type="number"
        min={0}
        max={99}
        value={s1}
        onChange={(e) => { setS1(e.target.value); setSaved(false); }}
        style={{
          width: 50,
          background: "#222",
          border: "1px solid #444",
          borderRadius: 4,
          color: "white",
          padding: "0.25rem 0.4rem",
          textAlign: "center",
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
        placeholder="0"
      />
      <span style={{ color: "#555" }}>–</span>
      <input
        type="number"
        min={0}
        max={99}
        value={s2}
        onChange={(e) => { setS2(e.target.value); setSaved(false); }}
        style={{
          width: 50,
          background: "#222",
          border: "1px solid #444",
          borderRadius: 4,
          color: "white",
          padding: "0.25rem 0.4rem",
          textAlign: "center",
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
        placeholder="0"
      />
      <button
        onClick={save}
        disabled={loading || s1 === "" || s2 === ""}
        style={{
          background: saved ? "#1a4a1a" : "#e8520a",
          color: "white",
          border: "none",
          borderRadius: 4,
          padding: "0.3rem 0.6rem",
          cursor: "pointer",
          fontSize: "0.8rem",
          fontWeight: 700,
          transition: "background 0.2s",
        }}
      >
        {saved ? "✓" : loading ? "…" : "OK"}
      </button>
    </div>
  );
}
