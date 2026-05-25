"use client";

import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <button className="btn-secondary" style={{ fontSize: "0.85rem" }} onClick={handleLogout}>
      Déconnexion
    </button>
  );
}
