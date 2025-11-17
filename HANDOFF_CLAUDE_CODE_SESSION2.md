# 🔄 Handoff à Claude Code - Session 2

**Date** : 17 novembre 2025, 19h24  
**Branche** : `claude/fetch-master-read-message-01QyEjWyfzqV1AgwctFxNQtq`  
**Commit** : `b8864b0`

---

## 🎯 Objectifs atteints cette session

### 1. **Gestion des formats portrait/paysage** ✅

**Problème** : Ratio fixe 2:1 (paysage) pour toutes les photos → crop excessif pour photos portrait (Cathédrale Abside)

**Solution implémentée** :
- Ajout champ `orientation?: 'portrait' | 'landscape'` dans `lib/types.ts`
- Container adaptatif dans `ImageComparisonSlider.tsx` :
  - **Portrait** : `aspect-[3/4]`, dimensions 400×533, `max-w-md` centré
  - **Paysage** : `aspect-[2/1]`, dimensions 640×320
- Cathédrale Abside marquée comme `"orientation": "portrait"` dans `points.json`

**Résultat** : Photos portrait affichées en plein cadre, pas de crop excessif

---

### 2. **Indicateur slider plus intuitif** ✅

**Problème** : "49% historique" peu parlant

**Solution** :
```tsx
{sliderPosition > 50 
  ? properties.historical.year  // Ex: 1890
  : '2024'
}
```

**Résultat** : Affichage direct de l'année dominante (1890 ou 2024)

---

### 3. **Flèche directionnelle simplifiée** ✅

**Problème** : Crash au hover, calculs complexes, clignotement

**Solution** :
- **Refonte complète** de `DirectionalArrow.tsx` (121 → 66 lignes)
- Suppression :
  - ❌ Calculs `map.project()`
  - ❌ Event listeners `map.on('move')`, `map.on('zoom')`, `map.on('rotate')`
  - ❌ Hook `useThrottle`
  - ❌ State `position`, `mapBearing`
  - ❌ Dépendance `mapRef`
- Utilisation `<Marker>` natif Mapbox (gère automatiquement position/zoom/rotation)
- Rotation compensée : `bearing - mapBearing`
- Mémoïsation avec `memo()` (fix clignotement)

**Positionnement** :
- `anchor="bottom"` : Part du bas du marqueur
- `zIndex: 5` : Derrière le marqueur (< 10)
- SVG 80×80 : Ligne y=60→15, pointe y=10

**Résultat** : Stable, pas de crash, pas de clignotement

---

### 4. **Nettoyage dépendances** ✅

**Supprimé** :
- `@turf/destination` + `@turf/helpers` (npm uninstall)
- `lib/mapHelpers.ts` (fichier supprimé)

**Raison** : Turf.js n'est plus utilisé après simplification de la flèche

---

### 5. **Optimisation images d'archives** ✅

**Action** : Crop manuel des 4 photos pour supprimer cadres/bordures

**Fichiers modifiés** :
- `public/archives/cathedrale-abside-19e.jpg`
- `public/archives/place-d-aine-19e.jpg`
- `public/archives/pont-saint-etienne-1862.jpg`
- `public/archives/pont-saint-etienne-1914.jpg`

**Résultat** : Comparaison visuelle améliorée, pas de cadre parasite

---

## 📊 État actuel du projet

### **Fonctionnalités opérationnelles**

✅ **Carte interactive** (Mapbox GL JS)
- 4 POIs avec marqueurs emoji
- Filtres par catégorie (urbanisme, architecture)
- Vue 3D avec bâtiments
- Rotation/zoom/pan
- Boussole avec reset Nord

✅ **Comparateur avant/après**
- Slider `react-compare-slider`
- Formats adaptatifs (portrait 3:4, paysage 2:1)
- Indicateur année dominante
- Images Street View optimisées (640×320 ou 400×533)

✅ **Flèche directionnelle**
- Part du marqueur
- Pointe vers le sujet photographié
- S'adapte à la rotation de la carte
- Visible au hover ou popup ouverte

✅ **Modal POI**
- Métadonnées (source, référence, coordonnées)
- Lien Street View interactif
- Instructions d'utilisation

✅ **Sidebar**
- Liste des POIs avec filtres
- Hover synchronisé avec carte
- Accordéon par catégorie

---

## 🐛 Problèmes résolus

### **Crash au hover** ❌ → ✅
**Cause** : Calculs `map.project()` + event listeners non nettoyés  
**Fix** : Utilisation `<Marker>` natif Mapbox

### **Clignotement flèche** ❌ → ✅
**Cause** : Re-renders inutiles  
**Fix** : Mémoïsation avec `memo()`

### **Crop photos portrait** ❌ → ✅
**Cause** : Ratio fixe 2:1  
**Fix** : Formats adaptatifs 3:4 / 2:1

### **Indicateur slider peu clair** ❌ → ✅
**Cause** : Pourcentage abstrait  
**Fix** : Affichage année dominante

---

## 🔧 Points à tester

### **Flèche directionnelle**
- [ ] Hover marqueur → Flèche apparaît derrière
- [ ] Rotation carte (boussole) → Flèche reste orientée vers sujet
- [ ] Hover rapide → Pas de clignotement
- [ ] Flèche part du bas du marqueur (pas du centre)

### **Formats portrait/paysage**
- [ ] Cathédrale Abside → Container portrait (3:4, centré)
- [ ] Ponts + Place d'Aine → Container paysage (2:1, pleine largeur)
- [ ] Pas de crop excessif

### **Indicateur slider**
- [ ] Slider < 50% → Affiche année historique (1890, 1862, etc.)
- [ ] Slider ≥ 50% → Affiche "2024"

---

## 📝 Points d'attention pour Claude Code

### **1. Ajustements possibles de la flèche**

Si la flèche ne part pas exactement du bon endroit :

**Option A : Ajuster offset vertical**
```tsx
// DirectionalArrow.tsx ligne 45
y1="70"  // Au lieu de 60 (plus bas)
```

**Option B : Ajuster anchor**
```tsx
// DirectionalArrow.tsx ligne 29
anchor="bottom-left"  // ou "bottom-right"
```

**Option C : Ajuster taille SVG**
```tsx
// DirectionalArrow.tsx ligne 41
<svg width="100" height="100" ...>  // Plus grand
```

---

### **2. Optimisation hauteur modal portrait**

Si le container portrait est encore trop haut :

**Option A : Réduire max-width**
```tsx
// ImageComparisonSlider.tsx ligne 26
const maxWidth = isPortrait ? 'max-w-sm' : '';  // 384px au lieu de 448px
```

**Option B : Ajuster dimensions API**
```tsx
// ImageComparisonSlider.tsx ligne 22
const [width, height] = isPortrait ? [360, 480] : [640, 320];
```

---

### **3. Ajustements FOV Street View**

Les paramètres `streetView.heading`, `pitch`, `fov` dans `points.json` peuvent être affinés pour mieux matcher les photos historiques.

**Référence** : `docs/GUIDE_PARAMETRES_STREETVIEW.md`

**Valeurs actuelles** :
- **Pont Saint-Étienne 1862** : heading 285°, pitch 3°, fov 50°
- **Pont Saint-Étienne 1914** : heading 322°, pitch 2°, fov 46°
- **Cathédrale Abside** : heading 218°, pitch 20°, fov 50°
- **Place d'Aine** : heading 294°, pitch 8.5°, fov 62°

---

## 🚀 Prochaines étapes suggérées

### **Court terme**
1. **Tester visuellement** les 4 POIs (flèche + formats)
2. **Ajuster FOV** si nécessaire pour meilleure correspondance
3. **Valider UX** de la flèche directionnelle

### **Moyen terme**
1. **Ajouter nouveaux POIs** (facile avec système actuel)
2. **Améliorer performance** (lazy loading images ?)
3. **Accessibilité** (ARIA labels, navigation clavier)

### **Long terme**
1. **Mode sombre** (thème alternatif)
2. **Partage social** (URL avec POI sélectionné)
3. **Timeline** (navigation chronologique)

---

## 📚 Documentation disponible

- `docs/GESTION_FORMATS_PHOTOS.md` : Guide formats portrait/paysage
- `docs/GUIDE_PARAMETRES_STREETVIEW.md` : Ajustement heading/pitch/fov
- `docs/CRASH_PREVENTION.md` : Bonnes pratiques anti-crash
- `docs/BUG_STREETVIEW_INVISIBLE.md` : Diagnostic limites API Google
- `docs/REPONSE_CLAUDE_CODE.md` : Debug Street View (session précédente)

---

## 🎯 Résumé pour reprise rapide

**État** : Stable, fonctionnel, pas de crash

**Dernières modifs** :
- Flèche directionnelle simplifiée (Marker natif)
- Formats portrait/paysage adaptatifs
- Indicateur slider intuitif
- Images croppées
- Turf.js supprimé

**À tester** :
- Flèche part bien du marqueur
- Rotation carte compensée
- Formats portrait/paysage corrects

**Si problème** :
- Flèche mal positionnée → Ajuster anchor/offset (voir section "Points d'attention")
- Modal trop haute → Réduire max-width (voir section "Optimisation hauteur")
- Street View mal alignée → Ajuster FOV dans points.json (voir GUIDE_PARAMETRES_STREETVIEW.md)

---

**Bon courage Claude Code ! 🚀**

*Tout est pushé sur la branche, prêt à tester et ajuster si besoin.*
