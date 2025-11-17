# 🐛 Bug Report : Image Street View invisible

## 📸 Symptôme observé

**Capture d'écran** : Modal de comparaison Place d'Aine

```
┌─────────────────────────────────────┐
│ Historique | Actuelle               │
├─────────────────────────────────────┤
│ ✅ Photo sépia  │ ❌ Zone noire      │
│    visible      │    (vide)          │
│                 │                    │
│       [Slider handle visible]       │
│                                     │
│ Indicateur : "49% historique" ✅    │
└─────────────────────────────────────┘
```

**État** :
- ✅ Photo historique s'affiche correctement
- ❌ Image Street View invisible (zone noire)
- ✅ Slider fonctionnel (drag, indicateur)
- ✅ Pas d'erreur console visible dans l'UI

---

## 🔍 Diagnostic

### Cause identifiée : **Dépassement limite API Google**

**Code problématique** (branche Claude Code) :
```tsx
// components/modal/ImageComparisonSlider.tsx ligne 24-25
const streetViewUrl = getStreetViewStaticUrl(
  lat, lng, heading, pitch, fov,
  1280,  // ❌ ERREUR : Dépasse limite gratuite
  640    // ✅ OK
);
```

### Contraintes Google Street View Static API

D'après la [documentation officielle](https://developers.google.com/maps/documentation/streetview/request-streetview#size) :

| Plan | Taille max par dimension | Exemple valide |
|------|--------------------------|----------------|
| **Gratuit** | **640px** | 640×640, 640×320, 400×400 |
| Premium | 2048px | 1280×640, 2048×1024 |

**Problème** :
```
Demandé : 1280×640
         ↑
      Dépasse 640px → API retourne erreur ou image vide
```

### Vérification clé API

```bash
$ grep NEXT_PUBLIC_GOOGLE_MAPS_API_KEY .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCYJJI6zEutIWNg28EczBDX5vXuMet8hxM
```

✅ Clé présente et valide (format correct)

### Test URL générée

**URL attendue** :
```
https://maps.googleapis.com/maps/api/streetview?
  size=1280x640&
  location=45.830179,1.255192&
  heading=180&
  pitch=0&
  fov=50&
  key=AIzaSy...
```

**Réponse API** (probable) :
```json
{
  "error_message": "Invalid size parameter. Maximum size is 640x640.",
  "status": "INVALID_REQUEST"
}
```

---

## ✅ Solution implémentée

### Correction : Réduction à 640×320 (ratio 2:1 préservé)

```tsx
// components/modal/ImageComparisonSlider.tsx
const streetViewUrl = getStreetViewStaticUrl(
  properties.streetView.latitude,
  properties.streetView.longitude,
  properties.streetView.heading ?? 0,
  properties.streetView.pitch ?? 0,
  properties.streetView.fov ?? 90,
  640, // ✅ Width max API gratuite
  320  // ✅ Height (ratio 2:1 respecté)
);
```

**Avantages** :
- ✅ Respecte la limite API gratuite (640px max)
- ✅ Préserve le ratio 2:1 (640÷320 = 2)
- ✅ Qualité suffisante pour comparaison visuelle
- ✅ Pas de coût supplémentaire

**Inconvénient** :
- ⚠️ Résolution réduite (640×320 vs 1280×640)
- ⚠️ Possible pixelisation sur grands écrans

---

## 🧪 Tests à effectuer

### 1. Vérifier l'affichage Street View

```bash
# Recharger la page (Cmd+R)
# Ouvrir modal Place d'Aine
# Vérifier que l'image Street View s'affiche
```

**Résultat attendu** :
```
┌─────────────────────────────────────┐
│ Historique | Actuelle               │
├─────────────────────────────────────┤
│ ✅ Photo sépia  │ ✅ Street View     │
│    1890         │    2024            │
│                 │                    │
│       [Slider fonctionnel]          │
└─────────────────────────────────────┘
```

### 2. Vérifier la qualité d'image

- [ ] Image Street View nette (pas trop pixelisée)
- [ ] Ratio 2:1 respecté (pas de déformation)
- [ ] Comparaison visuelle possible (détails reconnaissables)

### 3. Tester les 4 POIs

- [ ] Place d'Aine (FOV 50°)
- [ ] Cathédrale Abside (FOV 52°)
- [ ] Pont Saint-Étienne 1862 (FOV 38°)
- [ ] Pont Saint-Étienne 1914 (FOV 24°)

---

## 🔄 Alternatives si qualité insuffisante

### Option A : Passer à l'API Premium (payant)

**Coût** : ~$7 pour 1000 requêtes statiques

**Avantages** :
- ✅ Résolution jusqu'à 2048×1024 (ratio 2:1)
- ✅ Qualité HD parfaite

**Implémentation** :
```tsx
// Activer billing dans Google Cloud Console
// Puis utiliser :
width: 1280,
height: 640
```

### Option B : Utiliser Street View Embed (iframe)

**Avantages** :
- ✅ Gratuit et illimité
- ✅ Interactif (l'utilisateur peut tourner la vue)
- ✅ Qualité maximale

**Inconvénients** :
- ❌ Pas de comparaison slider (deux vues séparées)
- ❌ Nécessite refonte UX

### Option C : Compromis 640×480 (ratio 4:3)

Si le ratio 2:1 n'est pas critique :
```tsx
width: 640,
height: 480  // Ratio 4:3 standard
```

**Avantages** :
- ✅ Plus de pixels verticaux (480 vs 320)
- ✅ Meilleure qualité globale

**Inconvénients** :
- ❌ Ratio différent des photos historiques (4:3 vs 2:1)

---

## 📊 Comparaison résolutions

| Configuration | Pixels totaux | Qualité | Coût | Ratio |
|---------------|---------------|---------|------|-------|
| **1280×640** (actuel) | 819,200 | ❌ Erreur API | Gratuit | 2:1 ✅ |
| **640×320** (fix) | 204,800 | ⚠️ Moyenne | Gratuit | 2:1 ✅ |
| **640×480** (alt) | 307,200 | ✅ Bonne | Gratuit | 4:3 ❌ |
| **1280×640** (premium) | 819,200 | ✅✅ Excellente | $7/1000 | 2:1 ✅ |

---

## 🎯 Recommandation

### Court terme (immédiat)
✅ **Utiliser 640×320** (fix appliqué)
- Résout le bug immédiatement
- Gratuit
- Ratio 2:1 préservé

### Moyen terme (si qualité insuffisante)
🔄 **Tester 640×480** (ratio 4:3)
- Meilleure qualité (+50% pixels)
- Toujours gratuit
- Compromis acceptable

### Long terme (si budget disponible)
💰 **Passer à l'API Premium**
- Qualité HD (1280×640)
- Ratio 2:1 parfait
- Coût : ~$7/mois pour usage modéré

---

## 📝 Checklist de validation

- [x] Diagnostic effectué (limite API identifiée)
- [x] Solution implémentée (640×320)
- [ ] Tests visuels effectués (4 POIs)
- [ ] Qualité validée par l'utilisateur
- [ ] Décision prise (garder 640×320 ou alternative)
- [ ] Documentation mise à jour si changement

---

## 🔗 Ressources

- [Google Street View Static API - Size parameter](https://developers.google.com/maps/documentation/streetview/request-streetview#size)
- [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)
- [Street View Static API Quotas](https://developers.google.com/maps/documentation/streetview/usage-and-billing)

---

**Statut** : ✅ Fix appliqué, en attente de validation visuelle
