# ✦ Tournoi Rugby à 5 — Fêtes de Bardos

Application web pour la gestion du tournoi de rugby à 5 des fêtes de Bardos (*Bardozeko Festak*).

## Fonctionnalités

- **Inscriptions** — Formulaire public pour inscrire une équipe (max 8 équipes, 10 joueurs/équipe)
- **Planning automatique** — Génération round-robin sur 2 terrains de 10h à 12h30, matchs de 7 minutes, rotation équitable des arbitres
- **Résultats & Classement** — Saisie des scores et classement en temps réel (victoire = 3 pts, nul = 1 pt)
- **Interface admin** — Validation des équipes, génération du planning, saisie des résultats

## Stack technique

- **Next.js 16** (App Router, Server Components)
- **Prisma 7** + **PostgreSQL** (Neon / Vercel Postgres)
- **Tailwind CSS v4**
- **TypeScript**

## Installation locale

### Prérequis
- Node.js 20+
- Une base PostgreSQL (locale ou Neon free tier)

### Démarrage

```bash
# Cloner le repo
git clone git@github.com:franciosse/tournoi5bardos.git
cd tournoi5bardos

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs DATABASE_URL et ADMIN_PASSWORD

# Créer les tables en base
npx prisma db push

# Lancer en développement
npm run dev
```

L'app est disponible sur [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `ADMIN_PASSWORD` | Mot de passe de l'interface `/admin` |

## Déploiement sur Vercel

1. Connecter le repo sur [vercel.com](https://vercel.com)
2. Créer une base PostgreSQL (Vercel Postgres ou [Neon](https://neon.tech))
3. Ajouter `DATABASE_URL` et `ADMIN_PASSWORD` dans les variables d'environnement Vercel
4. Après le premier déploiement, initialiser la base :

```bash
npx prisma db push
```

## Structure de l'application

```
src/
  app/
    page.tsx              # Accueil
    inscription/          # Formulaire d'inscription public
    programme/            # Planning des matchs
    resultats/            # Classement et scores
    admin/                # Interface admin (protégée)
      login/              # Connexion admin
      equipes/            # Gestion des équipes
      planning/           # Génération du planning
      resultats/          # Saisie des scores
    api/                  # Routes API (REST)
  components/             # Composants React
  lib/
    prisma.ts             # Client Prisma
    auth.ts               # Authentification admin (cookie)
    scheduler.ts          # Algorithme de génération du planning
```

## Algorithme de planning

Le planning est généré en round-robin complet :
- 8 équipes → 28 matchs → 14 créneaux de 9 min (7 min + 2 min transition) sur 2 terrains
- Durée totale : ~2h06, dans la plage 10h00–12h30
- Arbitrage : à chaque créneau, les équipes qui ne jouent pas sont désignées arbitres selon un compteur de rotations pour garantir l'équité

## Couleurs

Noir `#111111` et orange `#e8520a` — couleurs du club, avec une touche basque (bande tricolore rouge/blanc/vert).
