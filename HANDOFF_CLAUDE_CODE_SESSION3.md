# 🔄 Handoff à Claude Code - Session 3

**Date** : 17 novembre 2025, 21h48  
**Branche** : `claude/fetch-master-read-message-01QyEjWyfzqV1AgwctFxNQtq`  
**Dernier commit Cascade** : En cours (fix position flèche)  
**Dernier commit Claude Code** : `402ae87` (fix z-index marqueurs)

---

## 🎯 Travail effectué cette session

### 1. **Fix position flèche : Offset vertical** ✅

**Problème** : Flèche ne partait pas du centre du marqueur blanc

**Analyse** :
```
Marqueur POI (anchor="bottom", 44px diamètre) :
     ┌─────┐
     │ 🏛️  │  ← Centre à ~22px du bas
     └──●──┘  ← Bas = lng/lat

Flèche (anchor="center", 120px SVG) :
     ┌─────────┐
     │    ●    │  ← Centre = lng/lat
     │    │    │
     │    ↑    │
     └─────────┘

❌ Les centres ne sont PAS alignés !
```

**Solution appliquée** :
```tsx
// DirectionalArrow.tsx ligne 30-31
anchor="bottom"      // Même anchor que marqueur
offset={[0, 22]}     // Décale de 22px (rayon marqueur 44px/2)
```

**Calcul dimensions marqueur** :
- Emoji : `text-2xl` = 24px
- Padding : `p-2` = 8px × 2 = 16px
- Border : `border-2` = 2px × 2 = 4px
- **Total** : 24 + 16 + 4 = **44px**
- **Rayon** : 44 / 2 = **22px**

**Résultat attendu** :
```
     ┌─────┐
     │ 🏛️  │
     └──●──┘  ← Bas marqueur = lng/lat
        │
        ↑     ← Flèche (bas + offset 22px = centre marqueur)
```

---

### 2. **Commits Claude Code intégrés** ✅

**Commit `e757f12`** : Position correcte + suppression clignotement
- Ajout `useMemo` pour `activeArrowPoint`
- Suppression recalcul `filteredPoints.find()` à chaque render
- Key stable sur `DirectionalArrow`

**Commit `402ae87`** : z-index marqueurs POI
- Ajout `style={{ zIndex: 10 }}` sur marqueurs (ligne 386)
- Garantit marqueurs au-dessus de la flèche (10 > 1)
- **Document ajouté** : `ANALYSE_AGENTS_GITHUB.md` (332 lignes)

---

## 🐛 Bugs identifiés

### **1. Clignotement flèche (NON RÉSOLU)** ⚠️

**Symptôme** : Flèche clignote au hover sur marqueur

**Cause probable** :
```tsx
// InteractiveMap.tsx ligne 367
<DirectionalArrow
  mapBearing={bearing}  // ⚠️ Change à chaque frame si rotation active !
/>
```

**Solutions possibles** :

**Option A : Throttle mapBearing** (RECOMMANDÉ)
```tsx
// Après ligne 24
const throttledBearing = useMemo(
  () => Math.round(bearing / 5) * 5,  // Arrondi à 5° près
  [bearing]
);

// Ligne 367
mapBearing={throttledBearing}  // Au lieu de bearing
```

**Option B : Désactiver transition pendant rotation**
```tsx
// DirectionalArrow.tsx ligne 34
className={bearing === 0 ? "transition-transform duration-300" : ""}
```

---

### **2. Bug mode 3D + bâtiments** 🆕

**Symptôme** : Bug non spécifié par l'utilisateur

**Code concerné** :
- `toggle3DView()` : ligne 63-89
- `toggle3DBuildings()` : ligne 249-252
- Layer 3D : ligne 255-337

**Points à vérifier** :
- [ ] Crash au passage 3D → 2D ?
- [ ] Bâtiments ne s'affichent pas ?
- [ ] Memory leak GPU ?
- [ ] Layer 'building-3d' déjà existante ?

**Logs disponibles** :
```tsx
console.log('Ajout layer bâtiments 3D...');
console.log('✅ Layer bâtiments 3D ajoutée');
console.error('❌ Erreur lors de la gestion des bâtiments 3D:', error);
```

---

## 📊 État actuel du code

### **Flèche directionnelle**

**Fichier** : `components/map/DirectionalArrow.tsx`

**Props** :
```tsx
interface DirectionalArrowProps {
  longitude: number;
  latitude: number;
  bearing: number;        // Angle photo (0-360°)
  mapBearing: number;     // Rotation carte (0-360°)
  visible: boolean;
}
```

**Rendu** :
```tsx
<Marker 
  anchor="bottom"         // Aligné avec marqueur POI
  offset={[0, 22]}        // Décalage = rayon marqueur
  style={{ zIndex: 1 }}   // Sous le marqueur (< 10)
>
  <svg width="120" height="120">
    <line x1="60" y1="60" x2="60" y2="15" />  // Part du centre SVG
  </svg>
</Marker>
```

**Rotation** :
```tsx
transform: `rotate(${bearing - mapBearing}deg)`
// Compense la rotation de la carte
```

---

### **Marqueurs POI**

**Fichier** : `components/map/InteractiveMap.tsx` ligne 381-401

**Anchor** : `bottom` (bas du cercle = lng/lat)  
**zIndex** : `10` (au-dessus de la flèche)  
**Dimensions** :
- Normal : 44px diamètre
- Hover : 60px diamètre (`scale-125`)

---

### **Ordre de rendu**

```tsx
<Map>
  {/* 1. Flèche (zIndex: 1, rendue en premier) */}
  {activeArrowPoint && <DirectionalArrow />}
  
  {/* 2. Marqueurs POI (zIndex: 10, rendus après) */}
  {filteredPoints.map(point => <Marker />)}
  
  {/* 3. Popup (zIndex: défaut ~20) */}
  {popupInfo && <Popup />}
</Map>
```

---

## 🔧 Points à tester

### **Position flèche**
- [ ] Flèche part du **centre exact** du cercle blanc
- [ ] Alignement correct en mode normal (44px)
- [ ] Alignement correct en mode hover (60px, scale 1.25)
- [ ] Pas de décalage au zoom/pan

### **Clignotement**
- [ ] Hover rapide sur marqueur → Pas de clignotement
- [ ] Rotation carte → Flèche stable
- [ ] Popup ouverte → Flèche stable

### **Mode 3D**
- [ ] Toggle 3D → Pas de crash
- [ ] Bâtiments 3D s'affichent correctement
- [ ] Retour 2D → Bâtiments masqués
- [ ] Pas de memory leak GPU

---

## 📝 Recommandations pour Claude Code

### **1. Priorité HAUTE : Fix clignotement**

**Action** : Implémenter throttle mapBearing

```tsx
// InteractiveMap.tsx après ligne 24
const throttledBearing = useMemo(
  () => Math.round(bearing / 5) * 5,
  [bearing]
);

// Ligne 367
<DirectionalArrow
  bearing={heading}
  mapBearing={throttledBearing}  // ✅ Au lieu de bearing
  visible={true}
/>
```

**Résultat attendu** : Flèche stable, pas de re-render à chaque frame

---

### **2. Priorité MOYENNE : Ajuster offset si besoin**

Si la flèche ne part toujours pas du centre exact :

**Option A : Ajuster offset**
```tsx
offset={[0, 24]}  // Au lieu de 22 (test +2px)
```

**Option B : Compenser le hover (scale 1.25)**
```tsx
// Calculer offset dynamique selon hover
const markerRadius = isHovered ? 30 : 22;  // 60px/2 : 44px/2
offset={[0, markerRadius]}
```

---

### **3. Priorité HAUTE : Débugger mode 3D**

**Actions** :
1. Reproduire le bug (étapes exactes ?)
2. Vérifier console logs
3. Tester séquence :
   - 2D → 3D → Bâtiments ON → Bâtiments OFF → 2D
4. Profiler mémoire GPU (Chrome DevTools)

**Si crash** :
- Vérifier `map.getLayer('building-3d')` avant `addLayer`
- Vérifier `map.getSource('composite')` existe
- Ajouter try/catch autour de `addLayer`

---

## 🚀 Prochaines étapes suggérées

### **Court terme**
1. ✅ **Tester position flèche** (offset 22px)
2. ⚠️ **Fix clignotement** (throttle mapBearing)
3. 🆕 **Débugger mode 3D** (reproduire bug)

### **Moyen terme**
1. **Optimiser performance** (voir `ANALYSE_AGENTS_GITHUB.md`)
2. **Accessibilité WCAG 2.1 AA** (modal + carte)
3. **Tests mobile** (iPhone SE, iPad)

### **Long terme**
1. **Agents GitHub** (frontend-architect + performance-engineer)
2. **Nouveaux POIs** (facile avec système actuel)
3. **Mode sombre** (thème alternatif)

---

## 📚 Documentation disponible

- `HANDOFF_CLAUDE_CODE_SESSION2.md` : Session précédente
- `ANALYSE_AGENTS_GITHUB.md` : Analyse agents (332 lignes, Claude Code)
- `docs/CRASH_PREVENTION.md` : Bonnes pratiques anti-crash
- `docs/GUIDE_PARAMETRES_STREETVIEW.md` : Ajustement heading/pitch/fov

---

## 🎯 Résumé pour reprise rapide

**État** : Stable, position flèche améliorée

**Dernières modifs** :
- Flèche : `anchor="bottom"` + `offset={[0, 22]}`
- Marqueurs : `zIndex: 10`
- useMemo : `activeArrowPoint`

**À faire** :
- Tester position flèche (offset 22px)
- Fix clignotement (throttle mapBearing)
- Débugger mode 3D (bug non spécifié)

**Si problème** :
- Flèche mal positionnée → Ajuster offset (22 → 24px)
- Clignotement → Throttle mapBearing (arrondi 5°)
- Crash 3D → Vérifier console logs + try/catch

---

**Bon courage Claude Code ! 🚀**

*Commit en cours de push par Cascade.*
