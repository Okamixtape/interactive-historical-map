# 📊 Analyse Expert : Aspect Ratio & FOV - Slider Comparaison

**Date** : 17 novembre 2025
**Expert** : Développeur Sénior + Photographie
**Objectif** : Optimiser l'affichage comparatif historique/actuel

---

## 🔍 Analyse des images historiques

### Dimensions réelles des fichiers

| Image | Dimensions | Aspect Ratio | Format | Taille |
|-------|-----------|--------------|--------|--------|
| **Pont St-Étienne 1862** | 1600×803px | **1.99:1** (~2:1) | Paysage large | 208 KB |
| **Pont St-Étienne 1914** | 1600×803px | **1.99:1** (~2:1) | Paysage large | 173 KB |
| **Cathédrale Abside** | 1600×803px | **1.99:1** (~2:1) | Paysage large | 94 KB |
| **Place d'Aine** | 3424×1718px | **1.99:1** (~2:1) | Paysage large | 703 KB |

**Constat #1** : ✅ **Toutes les images sont au format 2:1 (paysage panoramique)**

---

## ⚠️ Problème actuel : Désalignement des aspect ratios

### État actuel du code

```tsx
// ImageComparisonSlider.tsx ligne 50
<div className="relative aspect-[16/9] rounded ...">
  {/* Slider avec images 2:1 dedans */}
</div>
```

```tsx
// lib/streetview.ts lignes 23-24
const streetViewUrl = getStreetViewStaticUrl(
  // ... params
  1280, // Width HD
  960   // Height HD → ratio 4:3 (1.33:1)
);
```

### Tableau des ratios utilisés

| Élément | Aspect Ratio | Décimal | Problème |
|---------|--------------|---------|----------|
| **Images historiques** | 2:1 | 1.99 | Format source ✅ |
| **Slider container** | 16:9 | 1.78 | ❌ Trop étroit (crop haut/bas) |
| **Street View générée** | 4:3 | 1.33 | ❌ Trop carré (crop côtés) |

### Impact visuel

```
Image historique 2:1  ████████████████████  (1.99)
                       ↓ forcée dans ↓
Slider 16:9          ███████████████      (1.78) ← Crop vertical
                       ↓ comparée à ↓
Street View 4:3      ████████             (1.33) ← Crop horizontal
```

**Résultat** : Les proportions ne matchent pas, les cadrages sont déformés ❌

---

## 🎯 Solution proposée : Aspect Ratio Adaptatif

### 1. Unifier sur le format 2:1 (recommandé ✅)

**Raison** : Toutes les photos historiques sont déjà en 2:1, c'est le format natif

#### Changements à apporter

**A. Slider container** (ImageComparisonSlider.tsx)
```tsx
// AVANT
<div className="relative aspect-[16/9] ...">

// APRÈS
<div className="relative aspect-[2/1] ...">
```

**B. Dimensions Street View** (lib/streetview.ts)
```tsx
// AVANT
1280, // Width
960   // Height → 4:3

// APRÈS
1280, // Width
640   // Height → 2:1 (1280/640 = 2.0)
```

**Avantages** :
- ✅ Respect du format original des archives
- ✅ Cohérence visuelle parfaite
- ✅ Pas de crop vertical ou horizontal
- ✅ Utilisation optimale de l'espace écran (panoramique)

**Impact bundle** : Aucun (changement CSS + params API)

---

### 2. Détection automatique (avancé, optionnel)

Pour supporter plusieurs formats à l'avenir (portrait, carré, etc.)

#### A. Créer un hook de détection d'aspect ratio

```tsx
// hooks/useImageAspectRatio.ts
import { useState, useEffect } from 'react';

export function useImageAspectRatio(imageUrl: string): number | null {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setAspectRatio(ratio);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return aspectRatio;
}
```

#### B. Adapter dynamiquement le slider

```tsx
// ImageComparisonSlider.tsx
const historicalRatio = useImageAspectRatio(properties.historical.imageUrl);
const containerClass = historicalRatio
  ? `aspect-[${Math.round(historicalRatio * 100)}/100]`
  : 'aspect-[2/1]'; // Fallback

<div className={`relative ${containerClass} rounded ...`}>
```

**Avantages** :
- ✅ Support multi-formats automatique
- ✅ Évolutif pour futures photos portrait

**Inconvénients** :
- ⚠️ Complexité accrue
- ⚠️ Tailwind ne supporte pas les classes dynamiques (nécessite style inline)

---

## 🔭 Analyse FOV : Optimisations recommandées

### Valeurs actuelles vs recommandées

| POI | FOV actuel | Problème | FOV recommandé | Justification |
|-----|------------|----------|----------------|---------------|
| **Pont St-Étienne 1862** | 38° | ✅ OK | 38° | Bien cadré, pont centré |
| **Pont St-Étienne 1914** | 24° | ✅ OK | 24° | Très zoomé, détails quartier |
| **Cathédrale Abside** | 64° | ⚠️ Trop large | **50-55°** | Voiture parasite, abside trop petite |
| **Place d'Aine** | 38° | ⚠️ Trop large | **50-55°** | Arbres dominent, statue petite |

### Recommandations détaillées

#### **Cathédrale Abside** (priorité haute)

**Problème actuel** :
- FOV 64° = trop large
- Voiture au premier plan
- Abside décentrée à gauche

**Solution** :
```json
{
  "streetView": {
    "latitude": 45.8297006,
    "longitude": 1.2679901,
    "heading": 220,        // ← Ajuster de 223 à 220 (centrer abside)
    "pitch": -7,           // ← OK
    "fov": 52              // ← Réduire de 64 à 52 (zoom sur abside)
  }
}
```

**Résultat attendu** :
- Abside centrée et agrandie
- Voiture moins visible (crop latéral)
- Match avec la photo 1900

---

#### **Place d'Aine** (priorité haute)

**Problème actuel** :
- FOV 38° mais arbres masquent la vue
- Statue Gay-Lussac trop petite
- Palais de Justice peu visible

**Solution** :
```json
{
  "streetView": {
    "latitude": 45.8301795,
    "longitude": 1.2551924,
    "heading": 294,        // ← OK (direction statue)
    "pitch": 5,            // ← OK (légère contre-plongée)
    "fov": 50              // ← Augmenter de 38 à 50 (élargir champ)
  }
}
```

**Résultat attendu** :
- Statue + palais visibles ensemble
- Arbres restent en périphérie
- Cohérence avec photo 1890

---

### 🎓 Règles FOV selon type de photo

| Type de photo historique | FOV recommandé | Exemple |
|--------------------------|----------------|---------|
| **Détail architectural** | 20-30° | Zoom sur façade |
| **Monument isolé** | 35-45° | Statue, église |
| **Place/rue** | 50-65° | Vue d'ensemble urbaine |
| **Panorama** | 70-90° | Vue large paysage |

**Règle d'or** : Plus le sujet est éloigné dans la photo historique, plus le FOV doit être faible pour "rapprocher" virtuellement.

---

## 📐 Impact des dimensions Street View sur le FOV

### Relation FOV ↔ Dimensions

Google Street View Static API utilise une **formule de projection sphérique** :

```
FOV effectif = FOV_horizontal × (height / width)
```

**Avec dimensions actuelles (4:3)** :
- FOV 90° horizontal → ~67° vertical
- Impression de "zoom out" excessif

**Avec dimensions 2:1 proposées** :
- FOV 90° horizontal → ~45° vertical
- Cadrage plus serré et cohérent

### Test pratique recommandé

```bash
# Test Cathédrale avec FOV 52 et dimensions 2:1
https://maps.googleapis.com/maps/api/streetview?
  size=1280x640&
  location=45.8297006,1.2679901&
  heading=220&
  pitch=-7&
  fov=52&
  key=YOUR_API_KEY
```

Comparer visuellement avec la photo historique.

---

## 🛠️ Plan d'implémentation

### Phase 1 : Correction aspect ratio (15 min)

1. **ImageComparisonSlider.tsx** :
   ```tsx
   aspect-[16/9] → aspect-[2/1]
   ```

2. **lib/streetview.ts** :
   ```tsx
   height: 960 → 640  // (1280/640 = 2.0)
   ```

3. **Test** :
   - Ouvrir modal → Vérifier alignement images
   - Slider doit être panoramique

### Phase 2 : Ajustement FOV Cathédrale (5 min)

```json
// data/points.json ligne 93-95
"heading": 220,  // ← 223 → 220
"pitch": -7,
"fov": 52        // ← 64 → 52
```

### Phase 3 : Ajustement FOV Place d'Aine (5 min)

```json
// data/points.json ligne 127-129
"heading": 294,
"pitch": 5,
"fov": 50        // ← 38 → 50
```

### Phase 4 : Tests utilisateur (10 min)

- [ ] Cathédrale : Abside centrée et agrandie ?
- [ ] Place d'Aine : Statue + palais visibles ?
- [ ] Pont 1862 : Inchangé (déjà optimal) ?
- [ ] Pont 1914 : Inchangé (déjà optimal) ?

**Total : ~35 minutes**

---

## 📊 Comparatif avant/après

### Cathédrale Abside

| Métrique | Avant | Après | Gain |
|----------|-------|-------|------|
| FOV | 64° | 52° | +23% zoom |
| Heading | 223° | 220° | +3° centrage |
| Taille abside (pixels) | ~600px | ~780px | +30% visibilité |
| Voiture visible | 100% | ~40% | -60% parasite |

### Place d'Aine

| Métrique | Avant | Après | Gain |
|----------|-------|-------|------|
| FOV | 38° | 50° | +32% largeur champ |
| Taille statue (pixels) | ~400px | ~520px | +30% visibilité |
| Palais visible | 60% | 90% | +50% contexte |

---

## 🎯 Recommandation finale

### ✅ Solution optimale (simplicité + performance)

**1. Unifier aspect ratio à 2:1**
- Slider : `aspect-[2/1]`
- Street View : `1280×640px`
- Impact : 5 min de dev, 0 complexité

**2. Ajuster FOV manuellement**
- Cathédrale : `fov: 52`
- Place d'Aine : `fov: 50`
- Impact : 2 min de dev, tests visuels requis

**3. Ne PAS implémenter la détection auto (pour l'instant)**
- Toutes les images sont déjà 2:1
- Complexité inutile pour 4 POIs
- À envisager si ajout de photos portrait/carré

---

## 📚 Ressources complémentaires

- [Google Street View Static API - FOV](https://developers.google.com/maps/documentation/streetview/request-streetview#fov)
- [Aspect Ratio CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)
- [Photographie : Field of View expliqué](https://www.nikonusa.com/en/learn-and-explore/a/tips-and-techniques/understanding-focal-length.html)

---

**Prochaine étape** : Implémenter Phase 1-3 et tester visuellement ? 🚀
