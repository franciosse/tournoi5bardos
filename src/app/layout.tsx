import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Tournoi Rugby à 5 — Fêtes de Bardos",
  description:
    "Tournoi de rugby à 5 lors des fêtes de Bardos. Inscriptions, programme et résultats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#111" }}>
        <Nav />
        <main className="flex-1">{children}</main>
        <footer
          style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #222" }}
          className="py-6 text-center text-sm"
          aria-label="Pied de page"
        >
          <div className="basque-stripe mb-4" />
          <p style={{ color: "#888" }}>
            <span className="lauburu">✦</span> Tournoi Rugby à 5 · Fêtes de Bardos ·{" "}
            <span style={{ color: "#e8520a" }}>Bardozeko Festak</span>{" "}
            <span className="lauburu">✦</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
