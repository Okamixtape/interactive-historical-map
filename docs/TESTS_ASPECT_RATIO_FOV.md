# ✅ Tests à effectuer : Aspect Ratio 2:1 + FOV optimisé

**Date** : 17 novembre 2025
**Modifications** : Unification aspect ratio + optimisation FOV Cathédrale & Place d'Aine

---

## 📋 Checklist de test visuel

### 1. **Pont Saint-Étienne 1862** (inchangé)

**Paramètres** :
- FOV : `38°` (inchangé ✅)
- Heading : `286°`
- Pitch : `0°`

**À vérifier** :
- [ ] Le pont est bien centré horizontalement
- [ ] L'horizon est aligné entre historique et actuel
- [ ] Les proportions du pont matchent entre les deux vues
- [ ] Pas de crop visible sur les bords

**Résultat attendu** : ✅ Aucun changement visible (déjà optimal)

---

### 2. **Pont Saint-Étienne 1914** (inchangé)

**Paramètres** :
- FOV : `24°` (inchangé ✅)
- Heading : `325°`
- Pitch : `-3°`

**À vérifier** :
- [ ] Le quartier de l'Abbessaille est bien cadré
- [ ] Zoom cohérent avec la carte postale historique
- [ ] Pas de distorsion panoramique excessive

**Résultat attendu** : ✅ Aucun changement visible (déjà optimal)

---

### 3. **Cathédrale Saint-Étienne - Abside** ⭐ (modifié)

**Paramètres AVANT** :
- FOV : ~~`64°`~~ → **`52°`** ✨
- Heading : ~~`223°`~~ → **`220°`** ✨
- Pitch : `-7°` (inchangé)

**Changements attendus** :
1. **Zoom +23%** : Abside agrandie et mieux visible
2. **Centrage amélioré** : Rotation de 3° vers la gauche
3. **Voiture réduite** : Moins présente au premier plan

**À vérifier** :
- [ ] L'abside de la cathédrale est **centrée** dans le cadre
- [ ] L'abside est **plus grande** qu'avant (~30% de pixels en plus)
- [ ] La voiture stationnée est **moins visible** (crop latéral)
- [ ] Le cadrage global **match mieux** avec la photo historique 1900
- [ ] Pas de crop excessif qui couperait des éléments importants

**Résultat attendu** :
```
AVANT (FOV 64°):
╔════════════════════════════════════╗
║  Voiture █████                      ║
║           Abside (petite)           ║
║                                      ║
╚════════════════════════════════════╝

APRÈS (FOV 52°):
╔════════════════════════════════════╗
║      Voiture █                       ║
║         Abside (grande) ██           ║
║                                      ║
╚════════════════════════════════════╝
```

---

### 4. **Place d'Aine - Statue Gay-Lussac** ⭐ (modifié)

**Paramètres AVANT** :
- FOV : ~~`38°`~~ → **`50°`** ✨
- Heading : `294°` (inchangé)
- Pitch : `5°` (inchangé)

**Changements attendus** :
1. **Champ élargi +32%** : Vue plus large de la place
2. **Statue + Palais visibles ensemble** : Contexte urbain complet
3. **Arbres en périphérie** : Moins dominants

**À vérifier** :
- [ ] La statue de Gay-Lussac est **visible et reconnaissable**
- [ ] Le Palais de Justice (tribunal) est **visible en arrière-plan**
- [ ] Les arbres sont **moins dominants** (toujours présents mais périphériques)
- [ ] Le cadrage global **match mieux** avec la photo historique 1890
- [ ] La place entière est **compréhensible visuellement**

**Résultat attendu** :
```
AVANT (FOV 38°):
╔════════════════════════════════════╗
║  Arbres ████████                    ║
║     Statue (petite)                 ║
║       Palais (peu visible)          ║
╚════════════════════════════════════╝

APRÈS (FOV 50°):
╔════════════════════════════════════╗
║ Arbres ██  Statue ███  Palais ███  ║
║         (visible)    (visible)      ║
║                                      ║
╚════════════════════════════════════╝
```

---

## 🎨 Test de l'aspect ratio 2:1

**Modification globale** : Slider `aspect-[16/9]` → `aspect-[2/1]`

### À vérifier pour TOUS les POIs

- [ ] Le slider a un **format panoramique** (plus large que 16:9)
- [ ] Les images historiques **ne sont pas croppées** verticalement
- [ ] Les images Street View **ne sont pas croppées** horizontalement
- [ ] Les proportions semblent **naturelles et cohérentes**
- [ ] Pas de bandes noires ou d'espaces vides

**Comparaison visuelle** :
```
AVANT (16:9):
╔═══════════════════════════════════╗
║ ███████████████████████████████   ║  ← Plus haut
║ ███████████████████████████████   ║
╚═══════════════════════════════════╝

APRÈS (2:1):
╔═══════════════════════════════════════════╗
║ ███████████████████████████████████████   ║  ← Plus large
╚═══════════════════════════════════════════╝
```

---

## 🔍 Test détaillé du slider

### Fonctionnalités à retester

**Pour chaque POI** :

1. **Drag du curseur** (souris)
   - [ ] Le curseur se déplace fluidement de gauche à droite
   - [ ] La transition entre historique et actuel est progressive
   - [ ] Pas de lag ou saccades

2. **Touch** (si disponible sur tablette/mobile)
   - [ ] Le drag tactile fonctionne
   - [ ] Réactivité immédiate

3. **Clavier** (flèches ←→)
   - [ ] Tab focus sur le handle
   - [ ] Flèches déplacent le curseur
   - [ ] Feedback visuel du focus (ring gold)

4. **Indicateur de position**
   - [ ] Affiche le pourcentage correct (0-100%)
   - [ ] Se met à jour en temps réel

5. **Headers dynamiques**
   - [ ] Opacité change selon position du slider
   - [ ] "Historique" visible à gauche (>40%)
   - [ ] "Actuelle" visible à droite (<60%)

---

## 📸 Captures d'écran recommandées

Pour documenter les améliorations :

### Avant/Après Cathédrale
1. Screenshot AVANT (avec FOV 64°) - **si possible**
2. Screenshot APRÈS (avec FOV 52°)
3. Comparaison côte à côte

### Avant/Après Place d'Aine
1. Screenshot AVANT (avec FOV 38°) - **si possible**
2. Screenshot APRÈS (avec FOV 50°)
3. Comparaison côte à côte

### Format panoramique 2:1
1. Screenshot d'un POI avec slider visible en entier
2. Annoter les dimensions (largeur vs hauteur)

---

## 🐛 Problèmes potentiels à surveiller

### 1. Images Street View vides/erreur

**Symptôme** : Placeholder "Street View Unavailable"

**Cause** : API Key manquante ou invalide

**Solution** :
```bash
# Vérifier .env.local
cat .env.local | grep GOOGLE_MAPS

# Doit contenir :
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=votre_clé
```

### 2. Crop excessif sur images historiques

**Symptôme** : Haut/bas de la photo historique coupé

**Cause** : Aspect ratio 2:1 incompatible avec l'image

**Solution** : Vérifier dimensions réelles de l'image :
```bash
file /public/archives/nom-image.jpg
```

Si ratio différent de 2:1, ajuster `object-cover` → `object-contain`

### 3. Distorsion panoramique

**Symptôme** : Images étirées ou compressées

**Cause** : Conflit entre ratio slider et ratio images

**Solution** : Vérifier que `aspect-[2/1]` est bien appliqué dans le DOM

### 4. FOV trop ajusté

**Symptôme** : Vue trop zoomée ou trop large sur Cathédrale/Place d'Aine

**Solution** : Ajuster par paliers de ±5° :
- Cathédrale : tester 47°, 52°, 57°
- Place d'Aine : tester 45°, 50°, 55°

---

## 📊 Métriques de succès

### Critères objectifs

| Critère | Objectif | Mesure |
|---------|----------|--------|
| **Alignement horizontal** | ±5% | Éléments clés centrés |
| **Proportions cohérentes** | Ratio 2:1 | Pas de déformation |
| **Visibilité éléments clés** | 100% | Statue, abside visibles |
| **Parasites réduits** | -50% | Voiture, arbres périphériques |

### Critères subjectifs

- [ ] La comparaison est **immédiatement compréhensible**
- [ ] Les deux vues semblent **photographiées du même endroit**
- [ ] Le slider apporte une **valeur ajoutée claire** (pas juste "deux photos côte à côte")
- [ ] L'expérience est **agréable et fluide**

---

## 🚀 Validation finale

### Checklist complète

- [ ] Build Next.js réussi sans erreurs
- [ ] Tests visuels effectués sur les 4 POIs
- [ ] Screenshots avant/après capturés (Cathédrale, Place d'Aine)
- [ ] Pas de régression sur Pont 1862 et 1914
- [ ] Slider fonctionne sur desktop (Chrome, Firefox, Safari)
- [ ] Slider fonctionne sur mobile (si testable)
- [ ] Accessibilité clavier OK
- [ ] Performance 60 FPS maintenue

### Actions si tests KO

1. **Aspect ratio problématique** :
   - Revenir à `aspect-[16/9]`
   - Tester `aspect-[3/2]` comme compromis

2. **FOV inadapté** :
   - Ajuster par ±5° et retester
   - Utiliser le guide GUIDE_PARAMETRES_STREETVIEW.md

3. **Problème API Google** :
   - Vérifier quota dans Google Cloud Console
   - Tester avec une clé de test

---

## 📞 Feedback attendu

**Format recommandé** :

```
POI: [Nom du point d'intérêt]
Aspect ratio 2:1: ✅ OK / ⚠️ Problème / ❌ KO
FOV: ✅ OK / ⚠️ À ajuster / ❌ KO
Commentaire: [Description du ressenti visuel]
Screenshot: [Lien ou fichier joint]
```

---

**Prêt pour les tests ! 🚀**

Démarre l'app en dev (`npm run dev`) et parcours cette checklist méthodiquement.
