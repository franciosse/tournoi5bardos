"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Mot de passe incorrect.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "2.5rem" }}>🔐</span>
          <h1
            style={{
              color: "#e8520a",
              fontFamily: "Georgia, serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              margin: "0.5rem 0 0",
            }}
          >
            Administration
          </h1>
          <div className="basque-stripe" style={{ width: 80, margin: "0.75rem auto 0" }} />
        </div>

        {error && (
          <div
            style={{
              background: "#2a0a0a",
              border: "1px solid #8a1a1a",
              borderRadius: 6,
              padding: "0.6rem 1rem",
              color: "#f44336",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label
            style={{ display: "block", color: "#bbb", marginBottom: 6, fontSize: "0.9rem" }}
          >
            Mot de passe administrateur
          </label>
          <input
            className="input-field"
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ marginBottom: "1rem" }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "0.7rem" }}
            disabled={loading}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
