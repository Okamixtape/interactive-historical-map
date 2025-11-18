# 🎨 Guide Figma Make - Carte Interactive Patrimoine Limoges

**Date** : 17 novembre 2025
**Objectif** : Créer une maquette UX/UI professionnelle à partir des captures d'écran de l'application actuelle

---

## 📚 Ce que j'ai trouvé dans la documentation Figma

### **Figma Make utilise Claude Sonnet 4**

Bonne nouvelle ! Figma Make utilise le même modèle d'IA que Claude Code (Anthropic Claude Sonnet). Les mêmes techniques de prompting s'appliquent.

---

## 🎯 Structure de prompt OPTIMALE (5 éléments)

Figma recommande de structurer tes prompts en **5 zones** :

### 1. **CONTEXTE** (qui, quoi, pourquoi)
```
Qui utilise l'app, quel est le but, quel problème résout-elle
```

### 2. **DESCRIPTION** (fonctionnalités détaillées)
```
Ce que fait l'app, les interactions principales, le flux utilisateur
```

### 3. **PLATEFORME** (où s'affiche)
```
Desktop, mobile, tablette, responsive, tailles d'écran
```

### 4. **STYLE VISUEL** (look & feel)
```
Couleurs, typographie, ambiance, inspirations, design system
```

### 5. **COMPOSANTS UI** (éléments spécifiques)
```
Boutons, cartes, modals, formulaires, patterns d'interaction
```

---

## 🚀 PROMPT OPTIMISÉ pour ton projet

Voici un prompt **prêt à copier-coller** dans Figma Make :

---

### **PROMPT PRINCIPAL (à coller dans Figma Make)**

```
## CONTEXTE

Je développe une application web patrimoniale pour la ville de Limoges qui permet aux utilisateurs de comparer des photos d'archives historiques (1862-1914) avec des vues Street View actuelles. L'objectif est de rendre le patrimoine accessible à tous, y compris aux personnes âgées peu à l'aise avec la technologie (UX "mamie ivre" friendly).

Public cible :
- Habitants de Limoges intéressés par l'histoire locale
- Touristes découvrant la ville
- Personnes âgées peu technophiles
- Passionnés de patrimoine et d'architecture

---

## DESCRIPTION FONCTIONNELLE

L'application comporte 3 zones principales :

1. **Carte interactive Mapbox** (zone principale)
   - Vue 2D/3D avec bâtiments extrudés
   - 4 marqueurs de points d'intérêt (POI) avec emojis catégorisés
   - Flèche directionnelle indiquant l'angle de prise de vue de la photo
   - Contrôles : zoom (slider vertical), rotation (boussole), toggle 3D/bâtiments
   - Popup au clic sur marqueur avec aperçu et bouton "Voir la comparaison"

2. **Sidebar gauche** (liste des POIs)
   - Filtres par catégorie (Urbanisme, Architecture, etc.)
   - Cartes de POI avec thumbnail, titre, année, description
   - Hover synchronisé avec la carte (highlight du marqueur)
   - Accordéon par catégorie

3. **Modal de comparaison** (slider avant/après)
   - Header avec titre, adresse, catégorie, année
   - Slider interactif superposant photo historique et Street View
   - Curseur draggable (souris/tactile/clavier)
   - Indicateur d'année dominante (1890 ou 2024)
   - Métadonnées (source archives, coordonnées GPS)
   - Lien vers Street View interactif
   - Formats adaptatifs : portrait (3:4) et paysage (2:1)

Interactions clés :
- Clic sidebar → Ouvre popup sur carte
- Clic "Voir la comparaison" → Ouvre modal
- Hover marqueur → Affiche flèche directionnelle
- Drag slider → Compare les époques
- Rotation carte → Flèche reste orientée vers le sujet

---

## PLATEFORME

- **Desktop first** : Optimisé pour écrans 1920×1080 et 2560×1440
- **Responsive** : Adapté tablette (iPad) et mobile (iPhone SE minimum)
- **Navigateurs** : Chrome, Firefox, Safari, Edge (2 dernières versions)
- **Performance** : 60 FPS minimum, temps de chargement < 3s

---

## STYLE VISUEL (Design System "Heritage")

### Palette de couleurs
- **heritage-bordeaux** : #8B4513 (accent principal, boutons, titres)
- **heritage-cream** : #FFFAED (fond clair, cartes)
- **heritage-gold** : #D4AF37 (bordures, highlights, 30% opacité)
- **heritage-ink** : #2C1810 (texte principal)
- **sepia** : Tons sépia pour ambiance vintage

### Typographie
- **Titres** : font-serif (Georgia, Times New Roman)
- **Corps** : font-sans (système)
- Style italique pour les citations et sources

### Ambiance
- Élégance vintage, sobre et raffinée
- Inspiré des cartes anciennes et documents d'archives
- Pas de couleurs vives ou néon
- Ombres subtiles (shadow-vintage-lg)

### Bordures et arrondis
- border-2 border-heritage-gold/30 (bordure dorée subtile)
- rounded (coins arrondis doux)
- Pas d'angles vifs

---

## COMPOSANTS UI

### Marqueurs de carte
- Bouton rond blanc avec emoji centré (🏛️ 🌉 🏭 👻)
- Bordure heritage-bordeaux
- Ombre portée
- Effet hover : scale-125 + ring

### Cartes de POI (sidebar)
- Thumbnail image à gauche
- Titre + année + catégorie à droite
- Description tronquée
- Hover : surbrillance subtile

### Modal de comparaison
- Header bordeaux avec titre blanc
- Slider centré avec handle rond bordeaux/doré
- Métadonnées en bas (2 colonnes)
- Bouton fermer (X) en haut à droite
- Pas de footer (redondant)

### Contrôles de carte
- Boutons empilés verticalement (coin supérieur droit)
- Icônes simples avec tooltips
- Toggle actif/inactif visible
- Boussole avec aiguille Nord rouge

### Boutons
- Primaire : bg-heritage-bordeaux text-heritage-cream
- Hover : bg-heritage-ink
- Border heritage-gold/40
- Font-serif font-medium

---

## OBJECTIF DE CETTE MAQUETTE

Crée une maquette UI/UX complète qui :
1. Améliore l'ergonomie et l'intuitivité de l'interface actuelle
2. Renforce l'identité visuelle "patrimoine vintage"
3. Optimise l'accessibilité (WCAG 2.1 AA, navigation clavier)
4. Propose des améliorations UX pour les interactions clés
5. Maintient la cohérence du design system "Heritage"

Focus particulier sur :
- La modal de comparaison (élément central de l'expérience)
- La hiérarchie visuelle des contrôles de carte
- L'affordance des éléments interactifs
- L'adaptation mobile (touch-friendly)

---

## IMAGES DE RÉFÉRENCE

Je joins des captures d'écran de l'application actuelle :
- Vue d'ensemble desktop (carte + sidebar)
- Modal de comparaison (slider avant/après)
- Contrôles de carte (zoom, rotation, 3D)
- Vue mobile

Utilise ces images comme référence pour :
- Comprendre la structure actuelle
- Identifier les points d'amélioration
- Proposer des variantes optimisées
- Maintenir la cohérence avec le code existant
```

---

## 📸 Captures d'écran à prendre

Pour maximiser les résultats de Figma Make, prends ces **6 captures d'écran** :

### 1. **Vue d'ensemble desktop** (1920×1080)
- Carte visible avec tous les marqueurs
- Sidebar ouverte avec liste des POIs
- Contrôles visibles (zoom, rotation, 3D)

### 2. **Modal de comparaison ouverte**
- Slider au centre (~50%)
- Image historique et Street View visibles
- Header avec titre
- Métadonnées en bas

### 3. **Modal portrait** (Cathédrale Abside)
- Format 3:4 centré
- Montrer l'adaptation portrait

### 4. **Popup de marqueur**
- Aperçu du POI
- Bouton "Voir la comparaison"

### 5. **Contrôles de carte** (zoom)
- Panel des contrôles visible
- Slider de zoom
- Boussole
- Toggles 3D/Bâtiments

### 6. **Vue mobile** (si possible)
- Responsive sur petit écran
- Sidebar repliée ou adaptée

---

## 🎯 Conseils pour Figma Make (documentation officielle)

### **DO ✅**

1. **Front-load les détails** : Plus tu donnes de contexte dans le premier prompt, moins tu auras d'itérations.

2. **Utilise les 5 zones** : Contexte, Description, Plateforme, Style, Composants.

3. **Sois précis avec les mesures** : "16px d'espacement" plutôt que "un peu d'espace".

4. **Spécifie "référence" ou "exact"** : Dis si les images sont une inspiration ou un modèle à copier exactement.

5. **Procède par incréments** : Après le premier prompt, fais des petits ajustements successifs.

6. **Prépare tes fichiers** : Utilise Auto Layout dans Figma pour que Make comprenne mieux la structure.

### **DON'T ❌**

1. **Ne surcharge pas d'images** : Ajoute frame par frame, pas tout d'un coup.

2. **N'attends pas une copie parfaite** : Les images sont des suggestions, pas des templates.

3. **Ne fais pas de gros changements** : Itère progressivement.

4. **N'utilise pas de termes vagues** : "Aligne verticalement" → "Déplace de 20px vers le bas".

---

## 🔄 Workflow recommandé

### **Étape 1 : Premier prompt (principal)**
- Copie-colle le prompt optimisé ci-dessus
- Ajoute tes captures d'écran (bouton + → Upload image)
- Dis "Utilise ces images comme référence de style et structure"

### **Étape 2 : Itérations ciblées**
Exemples de prompts de suivi :
```
"Améliore la hiérarchie visuelle des contrôles de carte"
"Propose 2 variantes pour le header de la modal"
"Optimise le slider pour le tactile mobile"
"Ajoute un état hover plus visible sur les cartes POI"
"Rends la boussole plus intuitive"
```

### **Étape 3 : Export vers GitHub** (si besoin)
1. Publie le prototype Figma Make
2. Télécharge le code généré
3. Pousse vers ton repo GitHub
4. Utilise comme référence pour le CSS

---

## 📊 Ce que tu peux demander à Figma Make

### **Améliorations UX**
- "Propose une meilleure hiérarchie des contrôles"
- "Améliore l'affordance du slider de comparaison"
- "Optimise le flux clic sidebar → modal"
- "Rends la navigation clavier plus intuitive"

### **Variantes design**
- "Crée 3 variantes de couleurs pour le header"
- "Propose un mode sombre alternatif"
- "Montre différentes tailles de boutons pour mobile"

### **Responsive**
- "Adapte cette vue pour tablette iPad"
- "Optimise pour iPhone SE (320px)"
- "Crée une version mobile avec sidebar repliable"

### **Accessibilité**
- "Augmente le contraste pour WCAG AA"
- "Agrandis les zones tactiles à 48px minimum"
- "Ajoute des indicateurs de focus visibles"

---

## 🎓 Exemple de prompt de suivi

Après le premier résultat, tu peux affiner :

```
Améliore la modal de comparaison avec ces changements :

1. Handle du slider :
   - Agrandis à 56×56px (zone tactile)
   - Ajoute une ombre plus prononcée
   - Animation subtile au hover (scale 1.1)

2. Indicateur d'année :
   - Déplace en haut à gauche du slider
   - Police plus grande (text-sm → text-base)
   - Badge avec fond semi-transparent

3. Instructions d'utilisation :
   - Texte plus visible (opacity-70 → opacity-90)
   - Icône de geste swipe à côté du texte

4. Bouton fermer :
   - Plus grand (24px → 32px)
   - Hover plus visible (bg-white/20)

Garde le style "Heritage" avec les couleurs bordeaux/cream/gold.
```

---

## 📚 Documentation consultée

Sources officielles Figma :
- [8 Essential Tips for Using Figma Make](https://www.figma.com/blog/8-ways-to-build-with-figma-make/)
- [How to Write Great Prompts (Developer Docs)](https://developers.figma.com/docs/code/how-to-write-great-prompts/)
- [Attach designs and images to a prompt](https://help.figma.com/hc/en-us/articles/31304529835671)

Information clé : Figma Make utilise **Claude Sonnet 4** (Anthropic), donc les mêmes techniques de prompting que Claude Code s'appliquent.

---

## 🚀 Prêt à utiliser !

1. **Ouvre Figma Make** dans ton fichier Figma
2. **Copie-colle le prompt optimisé** (section "PROMPT PRINCIPAL")
3. **Ajoute tes 6 captures d'écran** via le bouton +
4. **Envoie** et attends le premier résultat
5. **Itère** avec des prompts de suivi ciblés

**Résultat attendu** : Une maquette UI/UX professionnelle qui améliore ton application tout en respectant l'identité "Heritage" patrimoniale. 🎯

---

**Bon design ! Et n'hésite pas à me montrer le résultat pour qu'on l'analyse ensemble.** 🎨
