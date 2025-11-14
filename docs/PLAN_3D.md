# 🎯 Plan d'Implémentation 3D - Carte Patrimoniale de Limoges

## 📊 État Actuel

**Version Stable** : `085edcb` (feat: Version 1.0 - Carte patrimoniale de Limoges avec UI rétro)

**Fonctionnalités Actuelles** :
- ✅ Carte 2D Mapbox avec style "standard"
- ✅ Marqueurs cliquables avec popups
- ✅ Sidebar avec filtres par catégorie
- ✅ Modal de comparaison (Archive + Street View)
- ✅ Navigation fluide

**Fonctionnalités 3D à Implémenter** :
- ❌ Vue 3D depuis sidebar (flyTo avec pitch)
- ❌ Bouton "Point de vue du photographe" (rotation bearing)
- ❌ Lignes de vue dorées avec flèches
- ❌ Bouton "Reset Camera" (retour 2D)

---

## 🚨 Leçons Apprises (Erreurs à NE PLUS FAIRE)

### ❌ Ce qui a cassé le site

1. **forwardRef + useImperativeHandle mal implémenté**
   - Complexité inutile
   - Dépendances circulaires dans les hooks
   - Bugs de lifecycle React

2. **Calculs d'offset dynamiques non mémoïsés**
   - `calculateOffset` appelé à chaque render
   - Re-renders en cascade
   - Performance dégradée

3. **Margin-left dynamique sur container carte**
   - Casse le layout Mapbox
   - Interactions bloquées
   - Sidebar recouvre la carte

4. **Lignes de vue recalculées à chaque render**
   - Nouveaux objets GeoJSON créés en boucle
   - Chrome freeze (boucle infinie)
   - CPU 100%

5. **Z-index anarchiques**
   - Sidebar `z-50`, bouton toggle `z-50`, overlay `z-40`
   - Couches mal ordonnées
   - Clics bloqués

### ✅ Règles d'Or

1. **Commits atomiques** : Une feature = Un commit
2. **Tester après CHAQUE modification**
3. **Si ça casse, rollback immédiat** (`git revert`)
4. **Ne JAMAIS "optimiser" ce qui marche**
5. **Garder le code SIMPLE** (pas de sur-ingénierie)
6. **Mémoïser les calculs coûteux** (`useMemo`, `useCallback`)
7. **Tester dans plusieurs navigateurs** (Chrome + Safari)
8. **Vider le cache navigateur** après rollback

---

## 📋 Plan d'Implémentation (Incrémental)

### Phase 1 : Vue 3D depuis Sidebar ⏱️ 20 min

**Objectif** : Clic sur un POI dans la sidebar → La carte vole en 3D vers ce point.

**Approche Simple** :
```tsx
// Dans page.tsx
const [selectedPOIId, setSelectedPOIId] = useState<string | null>(null);

const handlePOISelect = (poiId: string) => {
  setSelectedPOIId(poiId);
};

// Dans InteractiveMap.tsx
useEffect(() => {
  if (selectedPOIId && mapRef.current) {
    const point = points.find(p => p.properties.id === selectedPOIId);
    if (point) {
      const [lng, lat] = point.geometry.coordinates;
      const camera = point.properties.mapboxCamera;
      
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: camera?.zoom || 17,
        bearing: camera?.bearing || 0,
        pitch: camera?.pitch || 60,  // Vue 3D
        duration: camera?.duration || 2000,
        essential: true
      });
    }
  }
}, [selectedPOIId, points]);
```

**Fichiers à Modifier** :
- `app/page.tsx` : Ajouter état `selectedPOIId`
- `components/map/InteractiveMap.tsx` : Ajouter prop + useEffect

**Tests** :
- [ ] Clic sidebar → Animation 3D
- [ ] Pitch 60° visible
- [ ] Pas de freeze Chrome
- [ ] Fonctionne sur Safari

**Commit** :
```bash
git add -A
git commit -m "feat: Vue 3D depuis sidebar

- Clic POI sidebar → flyTo 3D (pitch 60°)
- useEffect simple sans forwardRef
- Testé Chrome + Safari"
```

---

### Phase 2 : Bouton "Point de Vue du Photographe" ⏱️ 15 min

**Objectif** : Dans la popup d'un marqueur, bouton qui oriente la carte selon `streetView.heading`.

**Approche** :
```tsx
// Dans InteractiveMap.tsx, dans le JSX de la Popup
<button
  onClick={() => {
    const heading = popupInfo.properties.streetView?.heading;
    const camera = popupInfo.properties.mapboxCamera;
    if (mapRef.current && heading) {
      mapRef.current.flyTo({
        bearing: heading,  // Direction de la photo
        pitch: camera?.pitch || 60,
        zoom: camera?.zoom || 17,
        duration: 1500,
        essential: true
      });
    }
  }}
  className="w-full bg-heritage-gold/20 text-heritage-bordeaux px-4 py-2 rounded border-2 border-heritage-gold/40 hover:bg-heritage-gold/30 transition-all"
>
  📷 Point de vue du photographe
</button>
```

**Fichiers à Modifier** :
- `components/map/InteractiveMap.tsx` : Ajouter bouton dans Popup

**Tests** :
- [ ] Bouton visible dans popup
- [ ] Clic → Rotation bearing
- [ ] Pitch reste à 60°
- [ ] Animation fluide

**Commit** :
```bash
git commit -m "feat: Bouton point de vue photographe

- Rotation carte selon streetView.heading
- Pitch 60° maintenu
- Testé sur tous les POI"
```

---

### Phase 3 : Lignes de Vue Dorées (OPTIMISÉES) ⏱️ 30 min

**Objectif** : Afficher des lignes dorées avec flèches montrant la direction de prise de vue.

**Approche Mémoïsée** (CRITIQUE) :
```tsx
// Fonction utilitaire (hors composant)
function calculateEndPoint(
  start: [number, number],
  bearing: number,
  distanceMeters: number
): [number, number] {
  const [lon, lat] = start;
  const R = 6371000; // Rayon Terre en mètres
  const bearingRad = (bearing * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  
  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(distanceMeters / R) +
    Math.cos(latRad) * Math.sin(distanceMeters / R) * Math.cos(bearingRad)
  );
  
  const newLonRad = ((lon * Math.PI) / 180) + Math.atan2(
    Math.sin(bearingRad) * Math.sin(distanceMeters / R) * Math.cos(latRad),
    Math.cos(distanceMeters / R) - Math.sin(latRad) * Math.sin(newLatRad)
  );
  
  return [
    (newLonRad * 180) / Math.PI,
    (newLatRad * 180) / Math.PI
  ];
}

// Dans InteractiveMap.tsx
const viewLinesData = useMemo(() => {
  return points
    .filter(point => point.properties.streetView?.heading)
    .map(point => {
      const [lng, lat] = point.geometry.coordinates;
      const heading = point.properties.streetView!.heading;
      
      // Point de départ : 15m du marqueur
      const startPoint = calculateEndPoint([lng, lat], heading, 15);
      // Point final : 80m du marqueur
      const endPoint = calculateEndPoint([lng, lat], heading, 80);
      
      // Ligne principale
      const lineData = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: [startPoint, endPoint]
        }
      };
      
      // Flèche triangulaire
      const arrowLeft = calculateEndPoint(endPoint, heading - 150, 8);
      const arrowRight = calculateEndPoint(endPoint, heading + 150, 8);
      
      const arrowData = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[endPoint, arrowLeft, arrowRight, endPoint]]
        }
      };
      
      return {
        id: point.properties.id,
        lineData,
        arrowData
      };
    });
}, [points]); // ← CRITIQUE : Ne recalcule QUE si points change

// Render
{viewLinesData.map(({ id, lineData, arrowData }) => (
  <React.Fragment key={`view-${id}`}>
    <Source type="geojson" data={lineData}>
      <Layer
        id={`view-line-${id}`}
        type="line"
        paint={{
          'line-color': '#b8860b',
          'line-width': 2.5,
          'line-opacity': 0.7,
          'line-dasharray': [1, 1.5]
        }}
      />
    </Source>
    
    <Source type="geojson" data={arrowData}>
      <Layer
        id={`view-arrow-${id}`}
        type="fill"
        paint={{
          'fill-color': '#b8860b',
          'fill-opacity': 0.8
        }}
      />
    </Source>
  </React.Fragment>
))}
```

**Fichiers à Modifier** :
- `components/map/InteractiveMap.tsx` : Ajouter fonction + useMemo + render

**Tests CRITIQUES** :
- [ ] Lignes visibles
- [ ] Flèches visibles
- [ ] **Chrome NE FREEZE PAS** (tester 5 min)
- [ ] CPU reste < 50%
- [ ] Pas de re-renders en boucle

**Commit** :
```bash
git commit -m "feat: Lignes de vue dorées optimisées

- useMemo pour éviter recalculs
- Lignes 15-80m du marqueur
- Flèches triangulaires
- Testé 5 min sans freeze Chrome"
```

---

### Phase 4 : Bouton Reset Camera ⏱️ 10 min

**Objectif** : Bouton pour revenir à la vue 2D par défaut.

**Approche** :
```tsx
// Dans InteractiveMap.tsx, après NavigationControl
<div className="absolute top-4 right-4 z-10">
  <button
    onClick={() => {
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [1.2639, 45.8336], // Centre Limoges
          zoom: 13,
          bearing: 0,
          pitch: 0,
          duration: 1500,
          essential: true
        });
        setPopupInfo(null); // Fermer popup si ouverte
      }
    }}
    className="bg-heritage-cream hover:bg-white shadow-vintage border-2 border-heritage-gold/40 rounded p-2.5 transition-all"
    aria-label="Réinitialiser la vue"
    title="Vue normale (2D)"
  >
    <svg className="w-5 h-5 text-heritage-bordeaux" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  </button>
</div>
```

**Fichiers à Modifier** :
- `components/map/InteractiveMap.tsx` : Ajouter bouton

**Tests** :
- [ ] Bouton visible en haut à droite
- [ ] Clic → Retour vue 2D
- [ ] Popup se ferme
- [ ] Animation fluide

**Commit** :
```bash
git commit -m "feat: Bouton Reset Camera

- Retour vue 2D (pitch 0°, bearing 0°)
- Ferme popup automatiquement
- Position top-right"
```

---

## 🎨 Design System 3D

### Paramètres par Défaut

```typescript
const DEFAULT_3D_PARAMS = {
  zoom: 17,
  pitch: 60,
  bearing: 0,
  duration: 2000
};

const DEFAULT_2D_PARAMS = {
  zoom: 13,
  pitch: 0,
  bearing: 0,
  duration: 1500
};
```

### Style Lignes de Vue

```typescript
const VIEW_LINE_STYLE = {
  color: '#b8860b',      // Or doré
  width: 2.5,
  opacity: 0.7,
  dasharray: [1, 1.5],   // Pointillés élégants
  startDistance: 15,     // 15m du marqueur
  endDistance: 80        // 80m du marqueur
};

const ARROW_STYLE = {
  color: '#b8860b',
  opacity: 0.8,
  size: 8,               // 8m de côté
  angle: 150             // Angle ouverture
};
```

---

## 🧪 Checklist de Test Complète

### Avant Chaque Commit

- [ ] `npm run build` → Succès
- [ ] TypeScript : 0 erreur
- [ ] ESLint : 0 erreur critique
- [ ] Test Chrome (5 min navigation)
- [ ] Test Safari (2 min navigation)
- [ ] Vider cache Chrome (`Cmd+Shift+R`)

### Tests Fonctionnels

**Vue 3D Sidebar** :
- [ ] Clic POI → Animation 3D
- [ ] Pitch 60° visible
- [ ] Bearing correct
- [ ] Zoom approprié
- [ ] Duration fluide (2s)

**Bouton Photographe** :
- [ ] Visible dans popup
- [ ] Rotation bearing fonctionne
- [ ] Pitch maintenu
- [ ] Animation fluide (1.5s)

**Lignes de Vue** :
- [ ] Toutes les lignes visibles
- [ ] Flèches visibles
- [ ] Direction correcte
- [ ] Style doré cohérent
- [ ] **Pas de freeze (CRITIQUE)**

**Reset Camera** :
- [ ] Bouton visible
- [ ] Retour 2D fonctionne
- [ ] Popup se ferme
- [ ] Animation fluide

### Tests Performance

- [ ] CPU < 50% en navigation
- [ ] RAM stable (pas de leak)
- [ ] Pas de warnings console critiques
- [ ] FPS > 30 en animation
- [ ] Pas de lag au scroll

---

## 📦 Structure Fichiers

```
interactive-historical-map/
├── app/
│   └── page.tsx                    # État selectedPOIId
├── components/
│   ├── map/
│   │   └── InteractiveMap.tsx      # Logique 3D + lignes de vue
│   ├── layout/
│   │   └── Sidebar.tsx             # Trigger sélection POI
│   └── modal/
│       └── PointModal.tsx          # Comparaison archives
├── data/
│   └── points.json                 # Données POI avec mapboxCamera
└── docs/
    ├── PLAN_3D.md                  # Ce document
    └── CHANGELOG_3D.md             # Historique implémentation
```

---

## 🚀 Déploiement

### Après Chaque Phase

1. **Test local** : http://localhost:3000
2. **Commit** : Message descriptif
3. **Push** : `git push origin master`
4. **Vercel** : Auto-déploiement (2-3 min)
5. **Test production** : URL Vercel
6. **Validation** : Tester toutes les features

### Variables d'Environnement Vercel

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoib2thbWl4dGFwZSIsImEiOiJjbWh3NHhpc3IwMWFzMmpzOWYyajM3eTN5In0.mCydKKpP-MKAAylbHRkoIA
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAAB9cT5zN3tFD2ezSAJO0NfevPwYw99xo
```

---

## 📊 Timeline Estimée

| Phase | Durée | Complexité | Risque |
|-------|-------|------------|--------|
| Phase 1 : Vue 3D sidebar | 20 min | 🟢 Faible | 🟢 Faible |
| Phase 2 : Bouton photographe | 15 min | 🟢 Faible | 🟢 Faible |
| Phase 3 : Lignes de vue | 30 min | 🟡 Moyenne | 🔴 Élevé (freeze) |
| Phase 4 : Reset camera | 10 min | 🟢 Faible | 🟢 Faible |
| **TOTAL** | **~1h15** | | |

**Temps de test** : +30 min (test complet après chaque phase)

**Total réaliste** : **~2h** (avec tests et commits)

---

## 🎯 Critères de Succès

### Fonctionnels
- ✅ Vue 3D depuis sidebar fonctionne
- ✅ Bouton photographe fonctionne
- ✅ Lignes de vue visibles et correctes
- ✅ Reset camera fonctionne
- ✅ Toutes les animations fluides

### Techniques
- ✅ Pas de freeze Chrome
- ✅ CPU < 50%
- ✅ Code propre et maintenable
- ✅ TypeScript strict OK
- ✅ Tests passent

### UX
- ✅ Animations fluides (60 FPS)
- ✅ Interactions intuitives
- ✅ Pas de bugs visuels
- ✅ Cohérence design

---

## 🆘 Plan de Secours

### Si Phase 3 (Lignes de Vue) Freeze Chrome

**Option A** : Réduire le nombre de lignes
```tsx
// Afficher seulement les lignes des POI visibles
const visiblePoints = points.filter(p => {
  // Logique de visibilité basée sur zoom/bounds
});
```

**Option B** : Désactiver temporairement
```tsx
// Ajouter un toggle dans les settings
const [showViewLines, setShowViewLines] = useState(false);
```

**Option C** : Simplifier le rendu
```tsx
// Une seule Source avec MultiLineString
const allLinesData = useMemo(() => ({
  type: 'FeatureCollection',
  features: points.map(/* ... */)
}), [points]);
```

### Si Rollback Nécessaire

```bash
# Identifier le dernier commit stable
git log --oneline

# Rollback
git reset --hard <commit-hash>
git push origin master --force

# Nettoyer cache
rm -rf .next
npm run dev
```

---

## 📝 Notes Importantes

1. **Toujours tester dans Chrome ET Safari** avant de commit
2. **Vider le cache navigateur** après chaque rollback
3. **Ne JAMAIS push sans avoir testé localement**
4. **Documenter les bugs** dans ce fichier
5. **Garder les commits atomiques** (une feature = un commit)

---

## 🔗 Ressources

- [Mapbox GL JS API](https://docs.mapbox.com/mapbox-gl-js/api/)
- [React Map GL](https://visgl.github.io/react-map-gl/)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Dernière mise à jour** : 14 novembre 2025, 20:58
**Version** : 1.0
**Statut** : 📋 Planification
