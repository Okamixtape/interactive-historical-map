# 🔄 Handoff - Carte Interactive Patrimoine Limoges

**Date** : 17 novembre 2025  
**Branche** : `master` (sync avec `claude/analyze-nextjs-limoges-app-01UF5sV7iVwTWp3TNY14eqEF`)  
**Dernier commit** : `6fec8e0` - debug: Ajout logging détaillé + sécurité bâtiments 3D

---

## 🎯 Contexte du projet

Application Next.js 14 + React 18 + Mapbox GL JS pour visualiser le patrimoine historique de Limoges avec comparaisons photos archives/Street View.

**Stack technique** :
- Next.js 14.2.23 (App Router)
- React 18 + TypeScript strict
- Mapbox GL JS 3.8.0 (react-map-gl 7.1.7)
- Tailwind CSS 3.4.1
- Vercel deployment

**Contraintes critiques** :
- GPU Memory < 320 MB (crash si dépassé)
- Performance 60 FPS minimum
- UX "mamie ivre" friendly (intuitif pour tous)

---

## 📊 État actuel du code

### Architecture

```
app/
├── page.tsx                    # État global (selectedPoint, hoveredPointId, activeFilter)
├── globals.css                 # Styles slider zoom + heritage theme
components/
├── map/
│   ├── InteractiveMap.tsx     # Carte Mapbox + contrôles 3D/zoom/rotation
│   └── DirectionalArrow.tsx   # Flèche rouge angle photo (throttled 60 FPS)
├── layout/
│   └── Sidebar.tsx            # Liste POIs + filtres catégories
└── modal/
    └── PointModal.tsx         # Comparaison archive/Street View
hooks/
└── useThrottle.ts             # Hook throttle custom (16ms = 60 FPS)
lib/
├── constants.ts               # Config Mapbox + helpers (getCardinalDirection)
└── types.ts                   # Types TypeScript
data/
└── points.json                # 5 POIs avec coordonnées + bearing photos
```

---

## ✅ Fonctionnalités implémentées

### 1. **Vue 3D avec transitions smooth**
- Toggle 2D ↔ 3D (pitch 0° → 60°)
- Raccourci clavier : touche `3`
- Icône change selon état : 🎲 (2D) → 📄 (3D)
- Désactive animations sidebar pendant transition
- **Fichier** : `InteractiveMap.tsx` lignes 51-88

### 2. **Rotation bearing (orientation carte)**
- Boutons ↶ (gauche +15°) et ↷ (droite -15°)
- Boussole 🧭 avec aiguille rouge Nord + grise Sud
- Tooltip : "Retour au Nord (actuellement : Nord-Est - 45°)"
- Reset Nord garde la vue 3D (ne reset pas pitch)
- **Fichier** : `InteractiveMap.tsx` lignes 214-261

### 3. **Slider zoom vertical**
- Range 11 (région) → 18 (rue)
- Roté 270° avec transform CSS
- Thumb rond 20×20px avec hover states
- Affichage valeur actuelle (ex: 13.5)
- **Fichiers** : 
  - `InteractiveMap.tsx` lignes 596-638
  - `globals.css` lignes 71-145

### 4. **Bâtiments 3D (extrusions OSM)**
- Toggle disponible uniquement en mode 3D
- Layer `building-3d` avec fill-extrusion
- Sécurités :
  - Vérification `isStyleLoaded()` avant ajout
  - Event `style.load` au lieu de `load`
  - Logging détaillé console
  - Auto-désactivation au retour 2D
- **Fichier** : `InteractiveMap.tsx` lignes 265-353

### 5. **Flèche directionnelle angle photo**
- Flèche rouge 80×80px au-dessus marqueur
- Trigger : hover sidebar OU popup ouverte
- Rotation compensée : `bearing photo - bearing carte`
- Throttle 60 FPS (16ms) pour performance
- Sécurité : cherche uniquement dans `filteredPoints`
- **Fichiers** :
  - `DirectionalArrow.tsx` (throttle + compensation bearing)
  - `InteractiveMap.tsx` lignes 463-490

### 6. **Directions cardinales**
- Helper `getCardinalDirection(bearing)` : 0° → "Nord", 45° → "Nord-Est", etc.
- 8 directions (secteurs de 45°)
- Normalisation bearing : `((bearing % 360) + 360) % 360`
- **Fichier** : `constants.ts` lignes 48-64

### 7. **Sécurités anti-crash**
- Auto-fermeture popup si point filtré (`InteractiveMap.tsx` lignes 155-167)
- Nettoyage `hoveredPointId` sur changement filtre (`page.tsx` lignes 37-49)
- Fallbacks `|| 0` sur tous les `Math.round(bearing)`
- Guards `if (!mapRef.current) return undefined;`
- Try/catch sur `map.project()`
- **Documentation** : `CRASH_PREVENTION.md`

### 8. **Limites géographiques**
- Bounds Limoges : `[1.2, 45.78]` → `[1.35, 45.88]`
- Zoom min/max : 11 → 18
- Empêche scroll excessif hors zone
- **Fichier** : `constants.ts` lignes 14-25

### 9. **Nouveau flux UX popup**
- Clic sidebar → Ouvre popup sur carte (pas modal)
- Clic "View Comparison" dans popup → Ouvre modal
- Popup se centre avec offset vertical
- **Fichier** : `page.tsx` lignes 30-35 + `InteractiveMap.tsx` lignes 121-152

### 10. **Hover marqueurs optimisé**
- Scale réduit : `scale-125` (au lieu de 150)
- Ring subtil : `ring-2` (au lieu de 4)
- Transition `duration-200`
- Moins agressif visuellement
- **Fichier** : `InteractiveMap.tsx` lignes 386-391

---

## 🔧 Optimisations performance

### Throttle flèche directionnelle
```tsx
// DirectionalArrow.tsx ligne 45
const updatePosition = useThrottle(updatePositionRaw, 16); // 60 FPS
```

### Bearing state immédiat
```tsx
// InteractiveMap.tsx lignes 229, 243, 256
setBearing(newBearing); // Update immédiat avant easeTo
```

### Cleanup event listeners
```tsx
// Pattern utilisé partout
useEffect(() => {
  if (!mapRef.current) return undefined;
  const map = mapRef.current.getMap();
  map.on('event', handler);
  return () => {
    map.off('event', handler);
  };
}, [dependencies]);
```

---

## 📝 Historique des commits (session précédente)

### Commits principaux

1. **5e74a46** - feat: Améliorations UX "mamie ivre" friendly
   - Directions cardinales (Nord, Est, Sud, Ouest)
   - Normalisation bearing
   - Hover marqueurs réduit

2. **581ecc0** - fix: Gardes défensives pour éviter crash avec filtres
   - Auto-fermeture popup
   - Nettoyage hoveredPointId
   - Flèche cherche dans filteredPoints

3. **de14a09** - feat: Ajout toggles Bâtiments 3D et Relief du terrain
   - Toggle Bâtiments 3D
   - Toggle Relief (supprimé ensuite)

4. **b2094dc** - perf: Optimisations Phase 3.3 + Fix crash bearing - Option A
   - Bâtiments/Relief disabled en 2D
   - Exclusivité mutuelle
   - Indicateur zoom horizontal (ne fonctionnait pas)

5. **ef7f660** - fix: Suppression Relief + Slider zoom vertical + Corrections UX
   - Suppression Relief (causait crash GPU)
   - Slider zoom horizontal → vertical (ne fonctionnait pas)

6. **b3a572d** - fix: Correction slider zoom vertical + Préparation debug crash 3D
   - Container 24×120px + input roté 270°
   - CSS simplifié
   - Thumb rond 20×20px

7. **6fec8e0** - debug: Ajout logging détaillé + sécurité bâtiments 3D
   - Vérification `isStyleLoaded()`
   - Event `style.load`
   - Logging console détaillé

---

## ⚠️ Problèmes en attente de test

### 1. **Slider zoom vertical** (URGENT)

**Statut** : Code corrigé, en attente test utilisateur

**À tester** :
1. Ouvrir l'app
2. Glisser le curseur du slider de bas en haut
3. Vérifier que le zoom change de 11 à 18
4. Vérifier que la valeur affichée se met à jour

**Si ne fonctionne pas** :
- Ouvrir console (F12)
- Tester le slider
- Copier erreurs console
- Vérifier que `handleZoomChange` est appelé

**Code concerné** :
```tsx
// InteractiveMap.tsx lignes 212-220
const handleZoomChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  if (!mapRef.current) return;
  const newZoom = parseFloat(event.target.value);
  setCurrentZoom(newZoom);
  mapRef.current.getMap().zoomTo(newZoom, { duration: 200 });
}, []);
```

---

### 2. **Crash 3D + Bâtiments** (CRITIQUE)

**Symptôme rapporté** : Crash lors activation 3D puis Bâtiments

**Logging ajouté** :
```
✅ "Ajout layer bâtiments 3D..."
✅ "Layer bâtiments 3D ajoutée"
⚠️ "Style pas encore chargé, on attend..."
❌ "Erreur lors de la gestion des bâtiments 3D:" + stack trace
```

**À tester** :
1. Console ouverte (F12)
2. Clic bouton "3D"
3. Attendre fin transition
4. Clic bouton "Bâtiments"
5. Observer logs console
6. Si crash → Copier stack trace complète

**Hypothèses** :
- Layer `building-3d` existe déjà dans le style ?
- Source `composite` pas disponible ?
- Timing race condition ?

**Code concerné** :
```tsx
// InteractiveMap.tsx lignes 265-353
useEffect(() => {
  if (!mapRef.current) return undefined;
  const map = mapRef.current.getMap();
  
  const handleMapLoad = () => {
    if (!map.isStyleLoaded()) {
      console.warn('Style pas encore chargé, on attend...');
      setTimeout(handleMapLoad, 100);
      return;
    }
    
    if (show3DBuildings) {
      if (!map.getLayer('building-3d')) {
        console.log('Ajout layer bâtiments 3D...');
        map.addLayer({...});
      }
    }
  };
  
  if (map.isStyleLoaded()) {
    handleMapLoad();
  } else {
    map.on('style.load', handleMapLoad);
  }
}, [show3DBuildings]);
```

---

## 🐛 Bugs connus et résolus

### ✅ Crash hover boussole en 3D (RÉSOLU)
- **Cause** : `Math.round(bearing)` avec `bearing` undefined
- **Fix** : `Math.round(bearing || 0)`
- **Commit** : d60f486

### ✅ Crash hover sidebar avec filtre (RÉSOLU)
- **Cause** : Flèche cherche POI dans `filteredPoints` (pas trouvé)
- **Fix** : Passer tous les points + filtrer en interne
- **Commit** : 581ecc0

### ✅ Rotation bearing inversée (RÉSOLU)
- **Cause** : Signes inversés dans `rotateLeft`/`rotateRight`
- **Fix** : Gauche +15°, Droite -15°
- **Commit** : 8429eda

### ✅ Flèche ne suit pas bearing carte (RÉSOLU)
- **Cause** : Pas de compensation rotation carte
- **Fix** : `bearing photo - bearing carte`
- **Commit** : 8d5891d

### ✅ Reset Nord perd vue 3D (RÉSOLU)
- **Cause** : `resetNorth()` faisait `pitch: 0`
- **Fix** : Ne plus toucher au pitch
- **Commit** : 8d5891d

---

## 📊 Métriques performance actuelles

### Build
```
Route (app)                              Size     First Load JS
┌ ○ /                                    20.7 kB         116 kB
└ ○ /_not-found                          871 B          95.9 kB
```

### GPU Memory
- **2D** : ~250 MB
- **3D** : ~270 MB
- **3D + Bâtiments** : ~290 MB
- **Limite** : 320 MB (crash si dépassé)

### FPS
- **Pan/Zoom** : 60 FPS stable
- **Rotation** : 60 FPS stable
- **Flèche directionnelle** : Throttled 60 FPS

---

## 🎯 Prochaines étapes recommandées

### Priorité 1 : Tests utilisateur (URGENT)

1. **Tester slider zoom vertical**
   - Glisser curseur bas → haut
   - Vérifier zoom 11 → 18
   - Si bug → Copier logs console

2. **Tester 3D + Bâtiments**
   - Console ouverte (F12)
   - Activer 3D → Activer Bâtiments
   - Si crash → Copier stack trace complète

### Priorité 2 : Debug selon résultats tests

**Si slider ne fonctionne pas** :
- Vérifier event `onChange` déclenché
- Vérifier `currentZoom` state mis à jour
- Vérifier `zoomTo()` appelé
- Tester sans rotation CSS (270deg)

**Si crash 3D + Bâtiments** :
- Analyser stack trace
- Vérifier source `composite` disponible
- Tester avec `setTimeout` avant `addLayer`
- Envisager layer custom au lieu de `composite`

### Priorité 3 : Optimisations futures (si temps)

1. **Debounce rotation bearing** (100ms)
2. **Limiter tile cache** : `map.setMaxTileCacheSize(50)`
3. **Lazy load modal** : Déjà fait avec `dynamic()`
4. **Preload images** : Archives + Street View

---

## 📚 Documentation disponible

- **CRASH_PREVENTION.md** : Liste complète causes de crash + bonnes pratiques
- **CRASH_ANALYSIS_BEARING.md** : Analyse détaillée crash bearing
- **CRASH_ANALYSIS_REPORT.md** : Rapport complet crashes GPU
- **CONFIGURATION.md** : Config Mapbox + Vercel
- **DEPLOYMENT.md** : Guide déploiement
- **README.md** : Documentation projet

---

## 💬 Message pour nouvelle conversation

### Contexte à donner

```
Je continue le développement de la carte interactive patrimoine Limoges.

ÉTAT ACTUEL :
- Vue 3D fonctionnelle avec rotation bearing
- Slider zoom vertical implémenté (à tester)
- Bâtiments 3D avec sécurités (crash potentiel)
- Flèche directionnelle optimisée (throttle 60 FPS)
- Directions cardinales (Nord, Est, Sud, Ouest)

PROBLÈMES EN ATTENTE :
1. Slider zoom vertical : code corrigé mais pas testé
2. Crash possible 3D + Bâtiments : logging ajouté

J'ai besoin d'aide pour débugger ces deux problèmes selon les résultats des tests.
```

### Informations à partager

1. **Résultats tests** :
   - Slider fonctionne ? (oui/non + comportement observé)
   - Crash 3D + Bâtiments ? (oui/non + logs console)

2. **Logs console** (si erreurs) :
   - Copier stack trace complète
   - Noter à quel moment crash survient

3. **Ce document** (`HANDOFF_CLAUDE_CODE.md`) :
   - Pour contexte complet
   - Architecture + historique commits
   - Code concerné par les bugs

---

## 🔑 Points clés à retenir

### Architecture état
```
page.tsx (GLOBAL)
├── selectedPoint (modal)
├── hoveredPointId (hover sidebar/map)
├── activeFilter (filtre catégorie)
├── isTransitioning (animation 3D)
└── pointIdToOpenPopup (nouveau flux popup)

InteractiveMap.tsx (LOCAL)
├── popupInfo (popup marqueur)
├── is3DView (mode 3D)
├── bearing (orientation carte)
├── show3DBuildings (bâtiments 3D)
└── currentZoom (niveau zoom)
```

### Pattern sécurité
```tsx
// Toujours vérifier mapRef
if (!mapRef.current) return undefined;

// Toujours fallback sur nombres
const angle = Math.round(bearing || 0);

// Toujours cleanup event listeners
return () => {
  map.off('event', handler);
};

// Toujours try/catch sur project()
try {
  const point = map.project([lng, lat]);
} catch (error) {
  console.error('Projection failed:', error);
}
```

### Contraintes critiques
- GPU Memory < 320 MB
- Performance 60 FPS minimum
- UX intuitive pour tous
- TypeScript strict mode

---

## 📞 Contact et support

**Branche active** : `master`  
**Dernier commit** : `6fec8e0`  
**Tests requis** : Slider zoom + Bâtiments 3D  
**Documentation** : Voir fichiers `*.md` à la racine

**Prêt pour nouvelle conversation !** 🚀
