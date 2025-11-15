# 🏛️ Carte Patrimoniale Interactive de Limoges

> Application web interactive permettant de comparer des archives historiques de Limoges avec des vues actuelles via Google Street View.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.30-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen.svg)](https://github.com)

![Carte Patrimoniale de Limoges](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

---

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Déploiement](#-déploiement)
- [Architecture](#-architecture)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## 🎯 Aperçu

Cette application permet de découvrir l'évolution de Limoges en comparant des photographies historiques avec des vues actuelles de Google Street View. Les utilisateurs peuvent :

- 🗺️ Explorer une carte interactive de Limoges
- 📸 Comparer des images d'archives avec des vues actuelles
- 🏛️ Filtrer par catégories (urbanisme, architecture, industrie, patrimoine disparu)
- 📱 Profiter d'une expérience responsive sur tous les appareils

---

## ✨ Fonctionnalités

### 🗺️ Carte interactive
- Visualisation des points d'intérêt sur une carte Mapbox
- Markers cliquables avec popups informatives
- Navigation fluide avec animations

### 📸 Comparaison temporelle
- Images historiques haute résolution
- Intégration Google Street View
- Modal de comparaison côte à côte

### 🎨 Interface utilisateur
- Design rétro inspiré des archives
- Thème personnalisé "patrimoine"
- Sidebar avec filtres par catégorie
- Accessibilité WCAG 2.1 niveau AA

### 🚀 Performance
- Bundle optimisé (105 kB First Load JS)
- Images optimisées (AVIF/WebP)
- Code splitting automatique
- Score Lighthouse > 95

### 🔒 Sécurité
- CSP Headers configurés
- Protection XSS, clickjacking
- Variables d'environnement sécurisées
- 0 vulnérabilité CVE

---

## 🛠️ Stack technique

### Core
- **[Next.js](https://nextjs.org/) 14.2.30** - Framework React avec App Router
- **[React](https://react.dev/) 18.3.1** - Bibliothèque UI
- **[TypeScript](https://www.typescriptlang.org/) 5.3** - Typage statique (strict mode)

### Cartographie
- **[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) 3.16.0** - Carte interactive
- **[react-map-gl](https://visgl.github.io/react-map-gl/) 8.1.0** - Composants React pour Mapbox

### Styling
- **[Tailwind CSS](https://tailwindcss.com/) 3.4** - Framework CSS utility-first
- **Custom theme** - Palette "patrimoine" (sepia, bordeaux, crème)

### Intégrations
- **Google Maps Embed API** - Street View
- **GeoJSON** - Format de données géographiques

---

## 📦 Installation

### Prérequis

- **Node.js** >= 18.17.0
- **npm** >= 9.0.0 ou **pnpm** >= 8.0.0

### 1. Cloner le repository

```bash
git clone https://github.com/Okamixtape/interactive-historical-map.git
cd interactive-historical-map
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copiez le fichier `.env.example` :

```bash
cp .env.example .env.local
```

Éditez `.env.local` avec vos clés API :

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

> 📖 Consultez [CONFIGURATION.md](CONFIGURATION.md) pour obtenir vos clés API.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Token public Mapbox | ✅ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Clé API Google Maps Embed | ✅ |

> ⚠️ **Important** : Ces variables sont préfixées par `NEXT_PUBLIC_` car elles sont exposées côté client. Configurez **impérativement** les restrictions d'URL sur vos dashboards respectifs.

### Configuration détaillée

Consultez [CONFIGURATION.md](CONFIGURATION.md) pour :
- Obtenir vos clés API (étape par étape)
- Configurer les restrictions de sécurité
- Personnaliser les paramètres de la carte

---

## 🚀 Déploiement

### Déploiement sur Vercel (recommandé)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Okamixtape/interactive-historical-map)

#### Étapes manuelles

1. **Installer Vercel CLI**

```bash
npm install -g vercel
```

2. **Déployer**

```bash
vercel
```

3. **Configurer les variables d'environnement**

```bash
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

4. **Redéployer avec les variables**

```bash
vercel --prod
```

> 📖 Consultez [DEPLOYMENT.md](DEPLOYMENT.md) pour un guide complet de déploiement.

### Autres plateformes

- **Netlify** : Configurez `Build command: npm run build` et `Publish directory: .next`
- **Docker** : Utilisez `output: 'standalone'` dans `next.config.mjs`

---

## 🏗️ Architecture

```
interactive-historical-map/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout racine avec metadata
│   ├── page.tsx                 # Page d'accueil (client component)
│   ├── error.tsx                # Error boundary
│   └── globals.css              # Styles globaux + Mapbox overrides
├── components/                   # Composants React
│   ├── layout/
│   │   └── Sidebar.tsx          # Sidebar avec filtres et liste POIs
│   ├── map/
│   │   └── InteractiveMap.tsx   # Carte Mapbox avec markers
│   └── modal/
│       ├── PointModal.tsx       # Modal de comparaison
│       └── StreetViewEmbed.tsx  # Iframe Google Street View
├── lib/                          # Utilitaires et configuration
│   ├── constants.ts             # Constantes (tokens, catégories)
│   └── types.ts                 # Types TypeScript
├── data/
│   └── points.json              # GeoJSON des POIs
├── public/
│   └── archives/                # Images historiques optimisées
├── next.config.mjs              # Configuration Next.js + Security Headers
├── tailwind.config.ts           # Configuration Tailwind + thème custom
└── tsconfig.json                # Configuration TypeScript strict
```

### Flux de données

```
User clicks marker
    ↓
InteractiveMap updates state
    ↓
page.tsx receives selection
    ↓
PointModal displays comparison
    ↓
StreetViewEmbed loads Street View
```

---

## 📝 Ajouter des points d'intérêt

Éditez `data/points.json` :

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [1.2611, 45.8312]
  },
  "properties": {
    "id": "unique-id",
    "title": "Nom du lieu",
    "address": "Adresse complète, 87000 Limoges",
    "category": "urbanisme",
    "description": "Description historique...",
    "historical": {
      "year": 1900,
      "imageUrl": "/archives/image.jpg",
      "source": "Archives Départementales de la Haute-Vienne",
      "archiveReference": "2 Fi 123"
    },
    "streetView": {
      "latitude": 45.8312,
      "longitude": 1.2611,
      "heading": 120,
      "pitch": 5,
      "fov": 90
    },
    "mapboxCamera": {
      "bearing": 120,
      "pitch": 60,
      "zoom": 17.5,
      "duration": 3000
    },
    "tags": ["tag1", "tag2"]
  }
}
```

### Catégories disponibles

- `urbanisme` 🏛️
- `architecture` 🏗️
- `industrie` 🏭
- `patrimoine-disparu` 🕰️

---

## 🧪 Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement (port 3000)

# Production
npm run build        # Compile l'application pour la production
npm start            # Lance le serveur de production

# Qualité du code
npm run lint         # Vérifie le code avec ESLint

# Vérification de sécurité
npm audit            # Audit des vulnérabilités (actuellement : 0 ✅)
```

---

## 🎨 Personnalisation

### Couleurs du thème

Éditez `tailwind.config.ts` :

```typescript
colors: {
  heritage: {
    cream: '#f5f1e8',      // Fond crème vintage
    bordeaux: '#6e4027',   // Bordeaux principal
    sepia: '#d4a574',      // Sepia pour les cartes
    gold: '#b8860b',       // Or pour les bordures
    ink: '#2c2416',        // Encre foncée
  },
}
```

### Configuration Mapbox

Éditez `lib/constants.ts` :

```typescript
export const INITIAL_VIEW_STATE = {
  longitude: 1.2611,   // Coordonnées de Limoges
  latitude: 45.8312,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

export const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';
```

---

## 🔒 Sécurité

### Security Headers configurés

- ✅ **Content-Security-Policy** (CSP)
- ✅ **X-Frame-Options** (Clickjacking)
- ✅ **X-Content-Type-Options** (MIME sniffing)
- ✅ **Referrer-Policy**
- ✅ **Permissions-Policy**

### Bonnes pratiques

- 🔐 Variables d'environnement jamais committées
- 🔐 API keys avec restrictions d'URL
- 🔐 TypeScript strict mode (0 `any`)
- 🔐 0 vulnérabilité CVE
- 🔐 Error boundary pour gérer les crashes

---

## 📊 Métriques de performance

| Métrique | Valeur | Status |
|----------|--------|--------|
| **First Load JS** | 105 kB | ✅ Excellent |
| **Images totales** | 2.2 MB | ✅ Optimisé |
| **Bundle Mapbox** | 1.6 MB (lazy) | ✅ Code splitting |
| **Vulnérabilités** | 0 | ✅ Sécurisé |
| **Lighthouse Performance** | > 95 | ✅ Excellent |

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour proposer des modifications :

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pushez sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Guidelines

- Code TypeScript strict (pas de `any`)
- Tests pour les nouvelles fonctionnalités
- Documentation des composants
- Respect du style guide (ESLint)

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Crédits

### Données et ressources

- **Archives historiques** : [Archives Départementales de la Haute-Vienne](https://archives.haute-vienne.fr/)
- **Cartographie** : [Mapbox](https://www.mapbox.com/)
- **Vues actuelles** : [Google Street View](https://www.google.com/streetview/)

### Technologies

- Framework: [Next.js](https://nextjs.org/)
- Cartographie: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)

---

## 📞 Support

Pour toute question ou problème :

- 🐛 Ouvrez une [issue](https://github.com/Okamixtape/interactive-historical-map/issues)
- 📧 Contactez : [votre-email@example.com]
- 📖 Consultez la [documentation complète](https://github.com/Okamixtape/interactive-historical-map/wiki)

---

<div align="center">

**Développé avec ❤️ pour le patrimoine de Limoges**

[⬆ Retour en haut](#-carte-patrimoniale-interactive-de-limoges)

</div>
