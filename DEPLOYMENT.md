# 🚀 Guide de Déploiement

Ce document vous guide pour déployer l'application **Carte Patrimoniale de Limoges** en production sur Vercel (recommandé) ou d'autres plateformes.

---

## 📋 Table des matières

- [Pré-requis](#-pré-requis)
- [Déploiement sur Vercel (recommandé)](#-déploiement-sur-vercel-recommandé)
- [Autres plateformes](#-autres-plateformes)
- [Configuration post-déploiement](#️-configuration-post-déploiement)
- [Checklist de production](#-checklist-de-production)
- [Monitoring et maintenance](#-monitoring-et-maintenance)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Pré-requis

Avant de déployer, assurez-vous d'avoir :

### ✅ Checklist pré-déploiement

- [ ] Clés API configurées ([CONFIGURATION.md](CONFIGURATION.md))
  - [ ] Mapbox token avec restrictions d'URL
  - [ ] Google Maps API key avec restrictions
- [ ] Application testée localement
  - [ ] `npm run dev` fonctionne
  - [ ] Carte s'affiche correctement
  - [ ] Street View fonctionne
- [ ] Build de production réussit
  ```bash
  npm run build
  npm start
  ```
- [ ] Aucune vulnérabilité CVE
  ```bash
  npm audit  # Doit afficher "found 0 vulnerabilities"
  ```
- [ ] Code committé sur Git
  ```bash
  git status  # Doit afficher "nothing to commit, working tree clean"
  ```

---

## ⚡ Déploiement sur Vercel (recommandé)

Vercel est la plateforme recommandée car :
- ✅ Créée par l'équipe Next.js
- ✅ Déploiement automatique depuis Git
- ✅ Optimisations Next.js natives
- ✅ SSL automatique
- ✅ CDN global inclus
- ✅ Plan gratuit généreux

### Méthode 1 : Interface Web (la plus simple)

#### Étape 1 : Créer un compte Vercel

1. Rendez-vous sur [vercel.com](https://vercel.com/)
2. Cliquez sur **"Sign Up"**
3. Connectez-vous avec GitHub (recommandé)
4. Autorisez Vercel à accéder à vos repositories

#### Étape 2 : Importer le projet

1. Sur votre Dashboard Vercel, cliquez sur **"Add New..." > "Project"**
2. Sélectionnez le repository `interactive-historical-map`
3. Vercel détecte automatiquement Next.js ✅

<details>
<summary>📸 Configuration automatique</summary>

```
┌──────────────────────────────────────┐
│ Configure Project                     │
├──────────────────────────────────────┤
│ Framework Preset: Next.js  ✅        │
│ Build Command: next build            │
│ Output Directory: .next               │
│ Install Command: npm install          │
└──────────────────────────────────────┘
```
</details>

4. **Ne cliquez PAS encore sur "Deploy"** → Configurez d'abord les variables d'environnement

#### Étape 3 : Configurer les variables d'environnement

1. Dépliez **"Environment Variables"**
2. Ajoutez vos clés API :

| Key | Value | All Environments |
|-----|-------|------------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `pk.eyJ1...` | ✅ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIza...` | ✅ |

3. Cochez **"All Environments"** (Production, Preview, Development)

<details>
<summary>📸 Exemple de configuration</summary>

```
┌─────────────────────────────────────────────┐
│ Environment Variables                        │
├─────────────────────────────────────────────┤
│ Key                              │ Value     │
│ NEXT_PUBLIC_MAPBOX_TOKEN        │ pk.eyJ... │ ✅ All
│ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY │ AIza...   │ ✅ All
│ [+ Add Another]                             │
└─────────────────────────────────────────────┘
```
</details>

#### Étape 4 : Déployer

1. Cliquez sur **"Deploy"**
2. Vercel va :
   - ✅ Cloner le repository
   - ✅ Installer les dépendances
   - ✅ Exécuter `npm run build`
   - ✅ Déployer sur le CDN
3. Attendez 2-3 minutes (premier déploiement)

#### Étape 5 : Vérifier le déploiement

1. Une fois terminé, Vercel affiche votre URL :
   ```
   🎉 https://interactive-historical-map-xxx.vercel.app
   ```

2. Cliquez sur le lien pour tester

3. Vérifiez :
   - ✅ La carte Mapbox s'affiche
   - ✅ Les markers sont cliquables
   - ✅ Street View fonctionne dans la modal

### Méthode 2 : CLI Vercel (avancé)

Pour les développeurs préférant la ligne de commande :

#### Étape 1 : Installer Vercel CLI

```bash
npm install -g vercel
```

#### Étape 2 : Se connecter

```bash
vercel login
```

Suivez les instructions (vérification par email)

#### Étape 3 : Configurer les variables

```bash
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
# Collez votre token Mapbox quand demandé
# Sélectionnez: Production, Preview, Development (toutes)

vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# Collez votre clé Google Maps quand demandé
# Sélectionnez: Production, Preview, Development (toutes)
```

#### Étape 4 : Déployer

```bash
# Déploiement preview (pour tester)
vercel

# Déploiement production
vercel --prod
```

#### Étape 5 : Vérifier

```bash
vercel ls  # Liste vos déploiements
vercel open  # Ouvre dans le navigateur
```

---

## 🌐 Autres plateformes

### Netlify

<details>
<summary>Guide de déploiement Netlify</summary>

#### Configuration

1. Connectez-vous sur [netlify.com](https://www.netlify.com/)
2. Cliquez sur **"Add new site" > "Import an existing project"**
3. Connectez GitHub et sélectionnez le repository
4. Configuration :
   - **Build command** : `npm run build`
   - **Publish directory** : `.next`
   - **Environment variables** :
     ```
     NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
     ```

#### Limitations

⚠️ **Attention** : Netlify ne supporte pas nativement Next.js App Router.
- Installez le plugin : `@netlify/plugin-nextjs`
- Ajoutez dans `netlify.toml` :
  ```toml
  [[plugins]]
    package = "@netlify/plugin-nextjs"
  ```
</details>

### Docker (auto-hébergement)

<details>
<summary>Guide Docker</summary>

#### Configuration Next.js

Ajoutez dans `next.config.mjs` :

```javascript
const nextConfig = {
  output: 'standalone',
  // ... reste de la config
};
```

#### Créer le Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables d'environnement pour le build
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Build et run

```bash
# Build
docker build \
  --build-arg NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN \
  --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
  -t carte-limoges .

# Run
docker run -p 3000:3000 carte-limoges
```
</details>

---

## ⚙️ Configuration post-déploiement

### 1. Configurer les restrictions d'URL

Une fois déployé, vous avez votre URL de production (ex: `https://carte-limoges.vercel.app`).

#### Mapbox

1. Dashboard Mapbox > Access tokens
2. Cliquez sur votre token > URL restrictions
3. Ajoutez :
   ```
   https://carte-limoges.vercel.app/*
   https://*.vercel.app/*  (si vous utilisez des preview deployments)
   ```
4. Cliquez sur **"Update token"**

#### Google Maps

1. Google Cloud Console > Credentials
2. Cliquez sur votre API key > Edit
3. Dans **"Website restrictions"**, ajoutez :
   ```
   https://carte-limoges.vercel.app/*
   https://*.vercel.app/*
   ```
4. Cliquez sur **"SAVE"**

### 2. Configurer un domaine personnalisé (optionnel)

#### Sur Vercel

1. Projet > Settings > Domains
2. Cliquez sur **"Add"**
3. Entrez votre domaine : `carte-limoges.fr`
4. Suivez les instructions pour configurer les DNS
5. Vercel génère automatiquement un certificat SSL ✅

#### Mettre à jour les restrictions d'URL

N'oubliez pas d'ajouter votre nouveau domaine dans les restrictions :
```
https://carte-limoges.fr/*
https://www.carte-limoges.fr/*
```

### 3. Activer les Analytics (optionnel)

#### Vercel Analytics

1. Projet > Analytics > Enable
2. Plan gratuit : 100k events/mois

#### Vercel Speed Insights

1. Projet > Speed Insights > Enable
2. Ajoute des métriques Web Vitals automatiquement

---

## ✅ Checklist de production

Avant de partager votre application publiquement :

### Sécurité

- [ ] Variables d'environnement configurées sur Vercel
- [ ] Restrictions d'URL Mapbox configurées avec URL de production
- [ ] Restrictions d'URL Google Maps configurées avec URL de production
- [ ] Restrictions API Google Maps (uniquement Maps Embed API)
- [ ] Alerte de budget Google Cloud à $0
- [ ] HTTPS activé (automatique sur Vercel ✅)
- [ ] Security headers configurés (dans `next.config.mjs` ✅)

### Performance

- [ ] Build de production réussit (`npm run build`)
- [ ] Images optimisées (AVIF/WebP)
- [ ] Lighthouse Score > 90
  ```bash
  # Tester avec Lighthouse
  npm install -g lighthouse
  lighthouse https://votre-url.vercel.app --view
  ```
- [ ] Bundle size < 200kB (First Load JS)
- [ ] Pas de console.log en production

### Fonctionnel

- [ ] Carte s'affiche correctement
- [ ] Markers cliquables
- [ ] Popups fonctionnelles
- [ ] Modal de comparaison fonctionne
- [ ] Street View s'affiche
- [ ] Filtres par catégorie fonctionnels
- [ ] Sidebar responsive
- [ ] Test sur mobile (Chrome, Safari)
- [ ] Test sur desktop (Chrome, Firefox, Safari)

### SEO

- [ ] Metadata configurée (titre, description)
- [ ] Open Graph tags (partage social)
- [ ] Robots.txt configuré (si nécessaire)
- [ ] Sitemap.xml (si multi-pages)

### Documentation

- [ ] README.md à jour
- [ ] CONFIGURATION.md complet
- [ ] DEPLOYMENT.md vérifié
- [ ] Contact/support configuré

---

## 📊 Monitoring et maintenance

### Surveiller l'usage des API

#### Mapbox

1. Dashboard > Statistics
2. Vérifiez :
   - Map loads quotidiens
   - Tendances mensuelles
   - Alertes si > 80% du quota (50k loads/mois)

#### Google Maps

1. Cloud Console > APIs & Services > Dashboard
2. Sélectionnez "Maps Embed API"
3. Vérifiez :
   - Requêtes quotidiennes
   - Erreurs 403/401
   - Budget alerts

### Surveiller les performances

#### Vercel Analytics

- Real User Monitoring (RUM)
- Web Vitals (LCP, FID, CLS)
- Erreurs JavaScript

#### Google Analytics (optionnel)

Ajoutez dans `app/layout.tsx` :

```typescript
// Google Analytics
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXX');
  `}
</Script>
```

### Mises à jour régulières

```bash
# Vérifier les vulnérabilités
npm audit

# Mettre à jour les dépendances
npm update

# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour Next.js (quand nouvelle version)
npm install next@latest react@latest react-dom@latest
```

---

## 🔧 Troubleshooting

### Build échoue sur Vercel

<details>
<summary>🔍 Diagnostic</summary>

**Erreur courante** : `Module not found`

**Solutions** :

1. Vérifier que les dépendances sont dans `package.json` :
   ```bash
   npm install  # Localement
   git add package.json package-lock.json
   git commit -m "fix: Update dependencies"
   git push
   ```

2. Vérifier les chemins d'import :
   ```typescript
   // ✅ Correct (alias @/ configuré)
   import { CATEGORIES } from '@/lib/constants';

   // ❌ Incorrect
   import { CATEGORIES } from '../../lib/constants';
   ```

3. Vérifier les variables d'environnement :
   - Vercel > Projet > Settings > Environment Variables
   - Les clés doivent commencer par `NEXT_PUBLIC_`
</details>

### 403 Forbidden après déploiement

<details>
<summary>🔍 Diagnostic</summary>

**Symptôme** : Carte ou Street View ne s'affichent pas

**Cause** : URL de production non autorisée dans les restrictions

**Solution** :

1. Récupérer l'URL exacte de votre déploiement Vercel
2. Ajouter dans les restrictions Mapbox ET Google Maps :
   ```
   https://votre-projet-xxx.vercel.app/*
   ```
3. Attendre 1-2 minutes pour la propagation
4. Rafraîchir la page (Ctrl+F5)
</details>

### Changements non visibles après redéploiement

<details>
<summary>🔍 Diagnostic</summary>

**Cause** : Cache CDN

**Solutions** :

1. **Hard refresh** : Ctrl+Shift+R (ou Cmd+Shift+R sur Mac)

2. **Purger le cache Vercel** :
   - Projet > Deployments
   - Cliquez sur le déploiement
   - Menu (...) > Redeploy

3. **Vérifier le commit** :
   ```bash
   git log -1  # Dernier commit
   # Comparer avec Vercel > Deployments > Latest commit
   ```
</details>

### Problèmes de performance en production

<details>
<summary>🔍 Diagnostic</summary>

**Symptôme** : Lenteur, scores Lighthouse faibles

**Solutions** :

1. **Activer les optimisations Next.js** :
   ```javascript
   // next.config.mjs
   const nextConfig = {
     compress: true,
     swcMinify: true,
     images: {
       formats: ['image/avif', 'image/webp'],
     },
   };
   ```

2. **Vérifier le bundle size** :
   ```bash
   npm run build
   # Analyser la sortie "First Load JS"
   ```

3. **Lazy load Mapbox** :
   ```typescript
   const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
     ssr: false,
     loading: () => <LoadingSpinner />
   });
   ```
</details>

---

## 📞 Support

Besoin d'aide ? Consultez :

- 📖 [Documentation Vercel](https://vercel.com/docs)
- 📖 [Documentation Next.js Deployment](https://nextjs.org/docs/deployment)
- 🐛 [Issues GitHub](https://github.com/Okamixtape/interactive-historical-map/issues)
- 💬 [Discord Vercel](https://vercel.com/discord)

---

## 🎉 Félicitations !

Votre application est maintenant en production ! 🚀

**Prochaines étapes** :
- Partagez l'URL avec vos utilisateurs
- Surveillez les analytics
- Collectez les feedbacks
- Itérez et améliorez

---

<div align="center">

**Déployé avec ❤️ sur Vercel**

[⬆ Retour en haut](#-guide-de-déploiement)

</div>
