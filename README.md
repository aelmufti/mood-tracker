# Daily Mood 🌟

Application web PWA pour noter votre journée de 1 à 10.

## Fonctionnalités

- ✅ Authentification email/mot de passe (Supabase)
- ✅ Noter sa journée de 1 à 10
- ✅ Raison obligatoire pour les notes 10/10
- ✅ Modification possible le jour même
- ✅ Historique des notes
- ✅ Statistiques (7j / 30j / global)
- ✅ Graphique d'évolution
- ✅ Streak (jours consécutifs)
- ✅ Export CSV
- ✅ Dark mode
- ✅ PWA (installable)
- ✅ Mobile-first

## Installation

1. Cloner le repo
2. Installer les dépendances :
```bash
npm install
```

3. Configurer Supabase :
   - Créer un projet sur [supabase.com](https://supabase.com)
   - Exécuter le script `supabase/schema.sql` dans l'éditeur SQL
   - Copier `.env.local.example` vers `.env.local` et remplir les variables

4. Lancer le serveur de développement :
```bash
npm run dev
```

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database + RLS)
- Recharts
- date-fns
