"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeamActions({
  teamId,
  currentStatus,
}: {
  teamId: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    setLoading(true);
    await fetch(`/api/equipes/${teamId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(false);
  }

  async function deleteTeam() {
    if (!confirm("Supprimer cette équipe définitivement ?")) return;
    setLoading(true);
    await fetch(`/api/equipes/${teamId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {currentStatus !== "approved" && (
        <button
          className="btn-primary"
          style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
          onClick={() => updateStatus("approved")}
          disabled={loading}
        >
          ✓ Valider
        </button>
      )}
      {currentStatus !== "rejected" && (
        <button
          style={{
            fontSize: "0.8rem",
            padding: "0.35rem 0.75rem",
            background: "#2a0a0a",
            color: "#f44336",
            border: "1px solid #8a1a1a",
            borderRadius: 6,
            cursor: "pointer",
          }}
          onClick={() => updateStatus("rejected")}
          disabled={loading}
        >
          ✕ Refuser
        </button>
      )}
      <button
        style={{
          fontSize: "0.8rem",
          padding: "0.35rem 0.75rem",
          background: "#1a1a1a",
          color: "#666",
          border: "1px solid #333",
          borderRadius: 6,
          cursor: "pointer",
        }}
        onClick={deleteTeam}
        disabled={loading}
      >
        🗑
      </button>
    </div>
  );
}
