# Carte Patrimoniale Interactive de Limoges

Une application web interactive permettant de comparer des archives historiques de Limoges avec des vues actuelles via Google Street View.

## Stack Technique

- **Next.js** 15.1+ (App Router)
- **TypeScript** 5.3+ (strict mode)
- **MapBox GL JS** v3.7+
- **react-map-gl** v8.1+
- **Tailwind CSS** 3.4+
- **@types/geojson** 7946.0.14+

## Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd interactive-historical-map
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_MAPBOX_TOKEN=votre_token_mapbox
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=votre_clé_google_maps
```

#### Obtenir les clés API :

**MapBox Token :**
1. Créez un compte sur [mapbox.com](https://www.mapbox.com/)
2. Accédez à votre tableau de bord
3. Copiez votre "Default public token"

**Google Maps API Key :**
1. Accédez à la [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez "Maps Embed API"
4. Créez des identifiants (API Key)
5. Restreignez la clé aux APIs nécessaires

### 4. Ajouter des images historiques

Placez vos images d'archives dans le dossier `public/archives/` :

```
public/archives/
  ├── boucherie-1860.jpg
  ├── halles-1890.jpg
  └── haviland-1920.jpg
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du Projet

```
/app
  /page.tsx                    # Route principale
  /layout.tsx                  # Root layout
  /globals.css                 # Styles globaux
/components
  /map
    /InteractiveMap.tsx        # Composant Map principal
  /modal
    /PointModal.tsx            # Modal comparaison
    /StreetViewEmbed.tsx       # Iframe Google Street View
/lib
  /types.ts                    # Types TypeScript centralisés
  /constants.ts                # Configuration (tokens API)
  /utils.ts                    # Fonctions utilitaires
/data
  /points.json                 # GeoJSON FeatureCollection
/public
  /archives                    # Images historiques
```

## Ajouter de Nouveaux Points d'Intérêt

Éditez le fichier `data/points.json` en suivant la structure GeoJSON :

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  "properties": {
    "id": "unique-id",
    "title": "Nom du lieu",
    "address": "Adresse complète",
    "category": "urbanisme|architecture|industrie|patrimoine-disparu",
    "description": "Description détaillée",
    "historical": {
      "year": 1900,
      "imageUrl": "/archives/image.jpg",
      "source": "Archives Haute-Vienne",
      "archiveReference": "FRAD087_XXX"
    },
    "streetView": {
      "latitude": 45.8312,
      "longitude": 1.2611,
      "heading": 120,
      "pitch": 5,
      "fov": 90
    },
    "tags": ["tag1", "tag2"]
  }
}
```

## Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm start` - Lance le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

## Optimisations Performance

- **Code Splitting** : Dynamic imports pour le modal
- **Image Optimization** : Next.js Image avec lazy loading
- **Bundle Size** : < 500kb initial bundle
- **Lighthouse Score** : Target > 85 mobile

## TypeScript Configuration

Le projet utilise le mode strict TypeScript avec :
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

Aucun type `any` n'est autorisé.

## Personnalisation des Couleurs

Les couleurs du thème patrimoine sont définies dans `tailwind.config.ts` :

- `heritage-cream`: #f9ede0
- `heritage-bordeaux`: #a76032
- `heritage-sepia`: #d78d45

## Licence

MIT

## Crédits

- Données historiques : Archives Départementales de la Haute-Vienne
- Cartographie : MapBox
- Vues actuelles : Google Street View
