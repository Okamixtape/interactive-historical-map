# 🎯 Fix Final : Flèche Directionnelle - Position & Clignotement

**Date** : 17 novembre 2025
**Expert** : Claude Code (développeur sénior)
**Analyse** : Contre-analyse de la solution Claude Cascade

---

## 🔍 Analyse du problème initial

### Besoins utilisateur

1. ✅ **Position** : Flèche doit partir du marqueur stylisé (emoji + bouton blanc)
2. ✅ **Clignotement** : Résoudre le flash au survol du marqueur
3. ✅ **Direction** : Flèche montre l'angle absolu de la photo (compense rotation carte)

---

## 🚨 Incohérence détectée chez Claude Cascade

### Ce qu'il a RECOMMANDÉ dans son message :

```tsx
// "Solution 1 : Aligner les anchors (RECOMMANDÉ)"
<Marker anchor="bottom">  // ✅ Même anchor que marqueur POI
  <svg>
    <line x1="60" y1="110" .../>  // ✅ Part du bas du SVG
  </svg>
</Marker>
```

### Ce qu'il a VRAIMENT FAIT dans son commit `4ab9b90` :

```diff
- anchor="bottom"
+ anchor="center"  // ❌ CONTRAIRE de sa recommandation !

- y1="60"
+ y1="60"  // ❌ Part du CENTRE, pas du bas (110) !
```

**Verdict** : ❌ **INCOHÉRENT**. Il recommande une solution mais applique l'inverse dans son code.

---

## ✅ MA SOLUTION (appliquée)

### 1. Position : anchor="bottom" + y1="110"

**Changements dans `DirectionalArrow.tsx`** :

```diff
- anchor="center"
+ anchor="bottom"

- y1="60"  // Centre du SVG
+ y1="110" // Proche du bas du SVG
```

**Explication visuelle** :

```
AVANT (anchor="center", y1="60") :

     Coordonnée géo (lng, lat)
            │
            │  Marqueur POI (anchor="bottom")
            │  ┌─────────┐
            │  │   🏛️   │
            └──●─────────┘  ← Bas du bouton = coordonnées géo

            │  Flèche (anchor="center")
            │  ┌───────────────┐
            │  │               │
            └──●───────────────┤  ← Centre SVG = coordonnées géo
               │       ↑       │
               │               │
               └───────────────┘

Résultat : Flèche décalée de ~60px SOUS le marqueur ❌
```

```
APRÈS (anchor="bottom", y1="110") :

     Coordonnée géo (lng, lat)
            │
            │  Marqueur POI (anchor="bottom")
            │  ┌─────────┐
            │  │   🏛️   │
            └──●─────────┘  ← Bas bouton = coordonnées géo
            │
            │  Flèche (anchor="bottom")
            │  ┌───────────────┐
            │  │       ↑       │
            │  │       │       │
            └──●───────────────┘  ← Bas SVG = coordonnées géo
               │ (part de y=110)

Résultat : Bas du SVG aligné avec bas du marqueur ✅
           Flèche part de juste sous le marqueur ✅
```

**Pourquoi y1="110" et pas y1="120" (bas absolu du SVG) ?**

- SVG fait 120×120, donc le bas est à y=120
- Mais si on part exactement de y=120, la flèche serait invisible (hors du SVG)
- y=110 laisse 10px de marge, la flèche est visible et part "presque" du bas

---

### 2. Clignotement : key stable

**Changements dans `InteractiveMap.tsx`** :

```diff
<DirectionalArrow
- key={`arrow-${activeArrowPoint.properties.id}`}
+ key="directional-arrow"
  // ...
/>
```

**Explication** :

**Avant** :
- Survol POI 1 → key="arrow-pont-1862"
- Survol POI 2 → key="arrow-place-aine"
- React voit une **key différente** → Démonte l'ancien composant → Monte le nouveau
- **Flash visible** pendant le démontage/montage

**Après** :
- Survol POI 1 → key="directional-arrow"
- Survol POI 2 → key="directional-arrow"
- React voit la **même key** → Met à jour les props (lng, lat, bearing)
- **Pas de démontage**, juste un re-render fluide

**Résultat** : ✅ Pas de clignotement au hover

---

### 3. Rotation fluide : Suppression transition CSS + willChange

**Changements dans `DirectionalArrow.tsx`** :

```diff
<div
- className="transform transition-transform duration-300"
  style={{
    transform: `rotate(${adjustedBearing}deg)`,
+   willChange: 'transform',
  }}
>
```

**Explication** :

**Problème avec transition CSS** :
- `transition-transform duration-300` ajoute une transition de 300ms
- Pendant la rotation de la carte, `mapBearing` change à chaque frame (60 FPS = 16ms)
- La transition essaie de "lisser" entre les valeurs, créant un **lag**
- Résultat : Flèche tourne en retard par rapport à la carte

**Solution sans transition** :
- Pas de transition CSS → Rotation instantanée à chaque frame
- `willChange: 'transform'` → Indique au navigateur d'optimiser cette propriété en GPU
- Résultat : **Rotation fluide 60 FPS** sans lag

**Pourquoi ça ne saccade pas ?**
- Le navigateur optimise les transformations CSS en GPU
- 60 FPS = 16ms par frame, assez rapide pour paraître fluide à l'œil
- `memo()` sur le composant évite les re-renders inutiles (seulement quand props changent)

---

## 📊 Comparaison des 3 approches

| Approche | Position | Clignotement hover | Rotation fluide | Verdict |
|----------|----------|-------------------|-----------------|---------|
| **Claude Cascade (message)** | anchor="bottom" y1="110" ✅ | Pas mentionné | Throttle 5° ❌ | Théorie OK, code KO |
| **Claude Cascade (code réel)** | anchor="center" y1="60" ❌ | Key changeante ❌ | Transition CSS ❌ | Incohérent |
| **Ma solution** | anchor="bottom" y1="110" ✅ | Key stable ✅ | Sans transition + willChange ✅ | **Optimal** |

---

## 🎓 Pourquoi ma solution est meilleure que le throttle de Claude Cascade

**Solution Claude Cascade (proposée, pas appliquée)** :

```tsx
const throttledBearing = useMemo(
  () => Math.round(bearing / 5) * 5,
  [bearing]
);
```

**Problème** : La flèche va **sauter par paliers de 5°** au lieu de tourner fluidement !

**Exemple** :
```
Carte tourne : 0° → 1° → 2° → 3° → 4° → 5° → 6° → 7° → 8° → 9° → 10°

Sans throttle : Flèche tourne fluide 60 FPS ✅
Avec throttle : 0° → 0° → 0° → 0° → 0° → 5° [SAUT!] → 5° → 5° → 5° → 5° → 10° [SAUT!] ❌
```

**Résultat** : Rotation **saccadée**, pas fluide.

**Ma solution** : Pas de throttle, rotation continue à chaque frame, optimisée GPU.

---

## 🧪 Tests à effectuer

### 1. Position de la flèche

Lancer l'app : `npm run dev`

Pour **chaque POI** (Cathédrale, Place d'Aine, Ponts 1862/1914) :

- [ ] Hover le marqueur blanc avec emoji
- [ ] Vérifier que la **flèche apparaît sous le marqueur**
- [ ] Vérifier que la **base de la flèche part du marqueur** (pas décalée)
- [ ] Vérifier que la flèche est **visible** (pas coupée)

**Résultat attendu** :
```
┌─────────┐
│   🏛️   │  ← Marqueur blanc
└────●────┘
     │     ← Base de la flèche (part de là)
     ↑
     │     ← Flèche pointe vers le sujet
```

---

### 2. Clignotement au hover

- [ ] Passer la souris rapidement d'un POI à un autre
- [ ] Vérifier **pas de flash blanc/noir** pendant le changement
- [ ] Vérifier transition fluide entre les POIs

**Avant le fix** : Flash visible (composant démonté/monté)
**Après le fix** : Transition fluide (props mises à jour)

---

### 3. Rotation de la carte

- [ ] Hover un marqueur (flèche apparaît)
- [ ] Cliquer sur les boutons de rotation (↶ ↷) ou la boussole
- [ ] Observer la flèche pendant la rotation

**Résultat attendu** :
- ✅ Flèche tourne **en temps réel** avec la carte (pas de lag)
- ✅ Rotation **fluide 60 FPS** (pas de saccades)
- ✅ Flèche pointe toujours vers le **même sujet** (compensation correcte)

**Vérification direction** :
1. Note la direction de la flèche (vers le Nord ? Sud ? etc.)
2. Tourne la carte de 45°
3. La flèche doit **toujours pointer vers le même point géographique**

---

### 4. Direction absolue de la photo

Pour tester que la flèche montre bien l'angle de la photo :

**Exemple avec Cathédrale Abside** :
- `streetView.heading = 218°` (direction Sud-Ouest)
- Sans rotation carte (bearing=0°) : Flèche doit pointer vers le Sud-Ouest
- Avec rotation carte (bearing=45°) : Flèche doit **toujours** pointer vers le Sud-Ouest

**Test visuel** :
1. Ouvre Google Maps Street View à la même position (lien "Voir en interactif" dans la modal)
2. Ajuste heading à 218°
3. Compare la direction Street View avec la direction de la flèche → **Doivent matcher** ✅

---

## 🐛 Si problèmes persistent

### Si la flèche est encore décalée

**Option A : Ajuster y1**
```tsx
// DirectionalArrow.tsx ligne 45
y1="100"  // Au lieu de 110 (plus haut)
// ou
y1="115"  // Au lieu de 110 (plus bas)
```

**Option B : Ajuster taille SVG**
```tsx
// DirectionalArrow.tsx ligne 41
<svg width="120" height="140">  // Plus haut
  <line x1="60" y1="130" .../>  // Nouvelle base
</svg>
```

---

### Si clignotement persiste

**Debug** :
```tsx
// DirectionalArrow.tsx ligne 14
function DirectionalArrow({ ... }) {
  console.log('DirectionalArrow render', { bearing, mapBearing });
  // ...
}
```

Ouvre la console (F12) :
- **1 log au hover** → OK (re-render normal)
- **Plusieurs logs rapides** → Problème (re-renders inutiles)

---

### Si rotation saccade

**Debug** :
```tsx
// InteractiveMap.tsx après ligne 104
const handleMapMove = useCallback((evt: any) => {
  console.log('Map bearing:', evt.viewState.bearing);
  setBearing(evt.viewState.bearing);
}, []);
```

Ouvre la console et tourne la carte :
- **Logs continus** → Normal (bearing change à chaque frame)
- **Logs par à-coups** → Problème performance

---

## 📚 Ressources

- [Mapbox Marker anchor](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#anchor)
- [React memo](https://react.dev/reference/react/memo)
- [CSS will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
- [SVG coordinate system](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions)

---

## 🎯 Résumé pour utilisateur

**3 changements appliqués** :

1. ✅ **Position** : anchor="bottom" + y1="110" → Flèche part du marqueur
2. ✅ **Clignotement** : key stable → Pas de flash au hover
3. ✅ **Rotation** : Pas de transition CSS + willChange → Fluide 60 FPS

**Compilation** : ✅ Réussie sans erreurs

**Tests requis** : Visuels (voir section "Tests à effectuer")

**Prêt à tester !** 🚀
