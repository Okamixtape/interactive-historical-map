# 🛡️ Prévention des Crashes - Carte Patrimoniale Limoges

## 🔴 Causes de crash identifiées

### 1. **Valeurs undefined dans Math.round()** ❌ CRITIQUE

**Symptôme** : Crash au hover sur boussole en 3D

**Cause** :
```tsx
// ❌ DANGEREUX
title={`Angle: ${Math.round(bearing)}°`}
style={{ transform: `rotate(${-bearing}deg)` }}
```

**Si `bearing` est `undefined` ou `NaN`** → Crash immédiat

**Solution** :
```tsx
// ✅ SÉCURISÉ
title={`Angle: ${Math.round(bearing || 0)}°`}
style={{ transform: `rotate(${-(bearing || 0)}deg)` }}
```

**Règle** : Toujours utiliser `|| 0` ou `?? 0` avec `Math.round()`, `Math.floor()`, etc.

---

### 2. **Coordonnées undefined dans DirectionalArrow** ❌

**Symptôme** : Crash au hover sidebar avec filtre actif

**Cause** :
```tsx
// ❌ DANGEREUX
<DirectionalArrow
  longitude={point.geometry.coordinates[0]}  // undefined si point filtré
  latitude={point.geometry.coordinates[1]}
/>
```

**Solution** :
```tsx
// ✅ SÉCURISÉ
const [lng, lat] = point.geometry.coordinates;
if (lng === undefined || lat === undefined) return null;

<DirectionalArrow longitude={lng} latitude={lat} />
```

**Règle** : Toujours vérifier `undefined` avant de passer des coordonnées.

---

### 3. **MapRef null dans useEffect** ❌

**Symptôme** : Crash au montage/démontage composant

**Cause** :
```tsx
// ❌ DANGEREUX
useEffect(() => {
  const map = mapRef.current.getMap();  // Peut être null
  map.on('rotate', handler);
}, []);
```

**Solution** :
```tsx
// ✅ SÉCURISÉ
useEffect(() => {
  if (!mapRef.current) return undefined;  // Early return
  
  const map = mapRef.current.getMap();
  map.on('rotate', handler);
  
  return () => {
    map.off('rotate', handler);  // Cleanup
  };
}, []);
```

**Règle** : Toujours vérifier `mapRef.current` avant `getMap()`.

---

### 4. **Event listeners non nettoyés** ❌

**Symptôme** : Memory leaks, comportements erratiques

**Cause** :
```tsx
// ❌ DANGEREUX
useEffect(() => {
  map.on('move', handler);
  // Pas de cleanup
}, []);
```

**Solution** :
```tsx
// ✅ SÉCURISÉ
useEffect(() => {
  if (!mapRef.current) return undefined;
  
  const map = mapRef.current.getMap();
  map.on('move', handler);
  
  return () => {
    map.off('move', handler);  // ✅ Cleanup obligatoire
  };
}, []);
```

**Règle** : Toujours nettoyer les event listeners dans le `return`.

---

### 5. **Points filtrés vs tous les points** ❌

**Symptôme** : Crash quand filtre actif et hover sidebar

**Cause** :
```tsx
// ❌ DANGEREUX
<InteractiveMap points={filteredPoints} />

// Dans InteractiveMap
const hoveredPoint = points.find(id);  // Pas dans filteredPoints
```

**Solution** :
```tsx
// ✅ SÉCURISÉ
<InteractiveMap 
  points={allPoints}           // Tous les points
  activeFilter={activeFilter}  // Filtre séparé
/>

// Dans InteractiveMap
const filteredPoints = activeFilter === 'all' 
  ? points 
  : points.filter(...);

// Afficher seulement filtrés
{filteredPoints.map(...)}

// Mais chercher dans tous
const hoveredPoint = points.find(id);  // ✅ Trouve toujours
```

**Règle** : Passer tous les points + filtre, filtrer en interne.

---

## 🛡️ Bonnes pratiques

### 1. **Fallbacks partout**

```tsx
// ✅ Nombres
const angle = bearing || 0;
const zoom = map?.getZoom() ?? 12;

// ✅ Strings
const title = point?.properties?.title || 'Sans titre';

// ✅ Arrays
const coords = point?.geometry?.coordinates || [0, 0];
```

---

### 2. **Guards en début de fonction**

```tsx
function Component({ data }) {
  // ✅ Guard immédiat
  if (!data) return null;
  if (!data.coordinates) return null;
  
  // Code sûr ici
  const [lng, lat] = data.coordinates;
}
```

---

### 3. **TypeScript strict**

```tsx
// ✅ Types explicites
interface Props {
  bearing: number;           // Pas number | undefined
  coordinates: [number, number];  // Pas number[]
}

// ✅ Vérifications runtime
if (typeof bearing !== 'number') return;
if (!Array.isArray(coordinates)) return;
```

---

### 4. **Try/catch pour projections**

```tsx
// ✅ Mapbox project() peut échouer
try {
  const point = map.project([lng, lat]);
  setPosition({ x: point.x, y: point.y });
} catch (error) {
  console.error('Projection failed:', error);
  // Fallback ou return
}
```

---

### 5. **Cleanup systématique**

```tsx
useEffect(() => {
  // Setup
  const handler = () => { ... };
  map.on('event', handler);
  
  // ✅ Cleanup obligatoire
  return () => {
    map.off('event', handler);
  };
}, [dependencies]);
```

---

## 📋 Checklist avant commit

- [ ] Tous les `Math.round()` ont un fallback `|| 0`
- [ ] Tous les `mapRef.current` sont vérifiés avant usage
- [ ] Tous les event listeners ont un cleanup
- [ ] Toutes les coordonnées sont vérifiées `!== undefined`
- [ ] Tous les `useEffect` retournent `undefined` ou cleanup
- [ ] Pas de `filteredPoints` passés quand on cherche par ID
- [ ] Try/catch autour des `map.project()`
- [ ] Types TypeScript stricts (pas `any`)

---

## 🔍 Tests anti-crash

### Test 1 : Hover rapide
1. Hover/unhover rapide sur sidebar (10x)
2. ✅ Pas de crash ?

### Test 2 : Rotation extrême
1. Cliquer 20x sur rotation gauche
2. Hover boussole
3. ✅ Pas de crash ?

### Test 3 : Filtre + hover
1. Activer filtre "architecture"
2. Hover POI "urbanisme" (filtré)
3. ✅ Pas de crash ?

### Test 4 : 3D + rotation + reset
1. Passer en 3D
2. Tourner carte plusieurs fois
3. Hover boussole
4. Reset Nord
5. ✅ Pas de crash ?

### Test 5 : Refresh brutal
1. Cmd+R pendant transition 3D
2. ✅ Pas de crash au reload ?

---

## 🚨 Signaux d'alerte

### Console errors à surveiller

```
❌ "Cannot read property 'getMap' of null"
→ mapRef.current non vérifié

❌ "NaN is not a valid value"
→ Math.round() sur undefined

❌ "Cannot read property '0' of undefined"
→ Coordonnées non vérifiées

❌ "Memory leak detected"
→ Event listeners non nettoyés
```

---

## 📊 État global vs local

### État actuel

```
page.tsx (GLOBAL)
├── points (tous)
├── selectedPoint
├── hoveredPointId
├── activeFilter
└── isTransitioning

InteractiveMap.tsx (LOCAL)
├── popupInfo
├── is3DView
├── bearing
└── filteredPoints (dérivé)

DirectionalArrow.tsx (LOCAL)
├── position
└── mapBearing
```

### Est-ce optimal ?

**✅ OUI pour cette app** car :

1. **État partagé** (page.tsx) :
   - `selectedPoint` : Modal + Map doivent le connaître
   - `hoveredPointId` : Sidebar + Map doivent le connaître
   - `activeFilter` : Sidebar + Map doivent le connaître

2. **État local** (composants) :
   - `is3DView` : Seulement Map s'en soucie
   - `bearing` : Seulement Map s'en soucie
   - `popupInfo` : Seulement Map s'en soucie

**Alternative (si app grandit)** :
- Zustand ou Context pour état global
- Mais **pas nécessaire** pour 5-10 POIs

---

## 🎯 Conclusion

**Règle d'or** : Toujours assumer que les données peuvent être `undefined` ou `null`.

**Pattern sûr** :
```tsx
// 1. Guard
if (!data) return null;

// 2. Destructure avec vérification
const [lng, lat] = data.coordinates;
if (lng === undefined) return null;

// 3. Fallback dans calculs
const angle = Math.round(bearing || 0);

// 4. Cleanup
return () => cleanup();
```

**En cas de doute** : Ajouter un `console.log()` et vérifier la valeur avant usage.
