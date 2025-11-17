# 🎯 Guide : Ajuster les paramètres Street View

## 📍 Localisation des paramètres

**Fichier** : `/data/points.json`

Chaque POI contient une section `streetView` avec 3 paramètres critiques :

```json
{
  "properties": {
    "streetView": {
      "latitude": 45.8286817,
      "longitude": 1.271351,
      "heading": 286,    // ← Angle horizontal (direction caméra)
      "pitch": 0,        // ← Angle vertical (inclinaison)
      "fov": 38          // ← Field of View (zoom/dézoom)
    }
  }
}
```

---

## 🔧 Les 3 paramètres à ajuster

### 1. **`heading`** - Direction de la caméra (0-360°)

**Définition** : Angle horizontal par rapport au Nord

```
        0° (Nord)
           ↑
           |
270° ← ----+---- → 90°
    (Ouest)|    (Est)
           |
           ↓
        180° (Sud)
```

**Comment trouver la bonne valeur** :
1. Ouvre [Google Maps Street View](https://www.google.com/maps)
2. Positionne-toi aux coordonnées GPS du POI
3. Tourne la vue jusqu'à voir le même cadrage que la photo historique
4. L'angle s'affiche en haut à droite de Street View (ex: "286°")

**Exemples** :
- **Place d'Aine** : `heading: 180` (vue vers le Sud, Palais de Justice)
- **Cathédrale Abside** : `heading: 220` (vue vers le Sud-Ouest, abside visible)

---

### 2. **`pitch`** - Inclinaison verticale (-90° à +90°)

**Définition** : Angle vertical de la caméra

```
+90° (Ciel)
    ↑
    |
 0° ---- (Horizon)
    |
    ↓
-90° (Sol)
```

**Valeurs typiques** :
- **`0°`** : Horizon (la plupart des photos historiques)
- **`-5° à -10°`** : Légère inclinaison vers le bas (vue plongeante)
- **`+5° à +10°`** : Légère inclinaison vers le haut (vue contre-plongée)

**Comment ajuster** :
1. Dans Street View, incline la vue avec la souris
2. L'angle s'affiche en haut à droite (ex: "-3°")

**Exemples** :
- **Place d'Aine** : `pitch: 0` (horizon)
- **Pont Saint-Étienne 1914** : `pitch: -3` (légère plongée)

---

### 3. **`fov`** - Field of View / Zoom (10-120°)

**Définition** : Champ de vision de la caméra (comme un objectif photo)

```
FOV 120° ←→ Grand angle (très large, déformé)
FOV 90°  ←→ Standard (défaut Street View)
FOV 60°  ←→ Normal (proche vision humaine)
FOV 40°  ←→ Téléobjectif (zoomé)
FOV 20°  ←→ Très zoomé (détails)
```

**🎯 RÈGLE D'OR** : Plus le FOV est **petit**, plus c'est **zoomé**

**Problème actuel** : FOV par défaut = 90° (trop large)

**Solutions recommandées** :
- **Photos larges** (paysage, place) : `fov: 60-70`
- **Photos standard** : `fov: 50-60`
- **Photos serrées** (détail bâtiment) : `fov: 30-40`
- **Photos très zoomées** : `fov: 20-30`

**Comment ajuster** :
1. Dans Street View, utilise la molette de la souris pour zoomer/dézoomer
2. Le FOV n'est **pas affiché** directement, il faut tester par essai-erreur
3. Règle empirique : 
   - Molette vers le haut (zoom in) = FOV diminue
   - Molette vers le bas (zoom out) = FOV augmente

**Exemples actuels** :
- **Pont Saint-Étienne 1862** : `fov: 38` ✅ (bien ajusté)
- **Pont Saint-Étienne 1914** : `fov: 24` ✅ (très zoomé)
- **Place d'Aine** : `fov: 90` ❌ (trop large, devrait être ~60)
- **Cathédrale Abside** : `fov: 90` ❌ (trop large, devrait être ~50)

---

## 🛠️ Workflow d'ajustement

### Étape 1 : Identifier le POI problématique

Ouvre la modal de comparaison et note les décalages :
- ✅ Bâtiment centré ? → `heading` OK
- ✅ Horizon aligné ? → `pitch` OK
- ❌ Trop zoomé/dézoomé ? → Ajuster `fov`

### Étape 2 : Ouvrir Google Maps Street View

**URL directe** :
```
https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=LAT,LNG&heading=HEADING&pitch=PITCH&fov=FOV
```

**Exemple pour Place d'Aine** :
```
https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=45.830179,1.255192&heading=180&pitch=0&fov=60
```

### Étape 3 : Ajuster manuellement

1. **Heading** : Tourne la vue avec la souris (clic gauche + drag horizontal)
2. **Pitch** : Incline la vue (clic gauche + drag vertical)
3. **FOV** : Zoom avec la molette de la souris

### Étape 4 : Noter les valeurs

Regarde en haut à droite de Street View :
```
Heading: 286°
Pitch: -3°
FOV: [non affiché, à estimer]
```

### Étape 5 : Mettre à jour `points.json`

```json
{
  "streetView": {
    "latitude": 45.830179,
    "longitude": 1.255192,
    "heading": 180,    // ← Valeur notée
    "pitch": 0,        // ← Valeur notée
    "fov": 60          // ← Valeur estimée
  }
}
```

### Étape 6 : Tester dans l'app

```bash
# Recharger la page (Cmd+R)
# Ouvrir la modal de comparaison
# Vérifier le résultat
```

Si pas satisfait, ajuster `fov` par incréments de ±5 et retester.

---

## 📊 Valeurs recommandées par POI

### Place d'Aine - Statue de Gay-Lussac

**Problème** : Vue trop large, arbres dominent

```json
"streetView": {
  "latitude": 45.830179,
  "longitude": 1.255192,
  "heading": 180,     // ← OK (statue + palais visibles)
  "pitch": 0,         // ← OK (horizon)
  "fov": 60           // ← Réduire de 90 à 60
}
```

### Cathédrale Saint-Étienne - Abside

**Problème** : Voiture au centre, abside à gauche, trop large

```json
"streetView": {
  "latitude": 45.8297006,
  "longitude": 1.2679901,
  "heading": 220,     // ← Tourner de ~40° vers la gauche
  "pitch": 0,         // ← OK
  "fov": 50           // ← Réduire de 90 à 50
}
```

---

## 🎓 Astuces avancées

### Trouver le bon FOV rapidement

**Méthode comparative** :
1. Ouvre la photo historique dans un onglet
2. Ouvre Street View dans un autre onglet
3. Alterne entre les deux (Alt+Tab)
4. Ajuste le zoom Street View jusqu'à ce que les proportions matchent

### Gérer les photos portrait

Pour les photos en format portrait (ex: Cathédrale Abside) :
- Le FOV doit être **plus petit** (~40-50°) pour compenser
- Considère ajuster les dimensions de l'image Street View (actuellement 1280x960)

**Code à modifier** (optionnel) :
```tsx
// lib/streetview.ts ligne 23-24
const [width, height] = isPortrait 
  ? [960, 1280]   // Portrait (3:4)
  : [1280, 960];  // Paysage (4:3)
```

### Simuler un recul de caméra

Si la caméra Street View est trop proche :
1. Note les coordonnées GPS actuelles
2. Cherche un point Street View plus éloigné dans la même direction
3. Mets à jour `latitude` et `longitude` dans `points.json`

---

## 🔗 Ressources

- [Google Maps Street View](https://www.google.com/maps)
- [Street View Static API Docs](https://developers.google.com/maps/documentation/streetview/overview)
- [Calculateur d'angles](https://www.omnicalculator.com/math/angle)

---

## 📝 Checklist de validation

Pour chaque POI ajusté :

- [ ] Bâtiment principal centré horizontalement (`heading`)
- [ ] Horizon aligné avec la photo historique (`pitch`)
- [ ] Proportions similaires entre historique et actuelle (`fov`)
- [ ] Pas d'éléments parasites dominants (voitures, arbres)
- [ ] Reconnaissance visuelle immédiate du lieu

---

**Bon courage pour les ajustements ! 🎯**
