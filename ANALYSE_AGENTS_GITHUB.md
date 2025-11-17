# 🎯 Analyse : Agents GitHub pour le Projet Carte Interactive Limoges

**Date** : 17 novembre 2025
**Analyste** : Claude Code (développeur sénior)
**Source** : https://github.com/edmund-io/edmunds-claude-code/tree/main/.claude/agents

---

## 📊 Agents disponibles (11 total)

1. **backend-architect.md** - Architecture backend
2. **deep-research-agent.md** - Recherche approfondie
3. **frontend-architect.md** - Architecture frontend ⭐
4. **learning-guide.md** - Guide d'apprentissage
5. **performance-engineer.md** - Optimisation performances ⭐
6. **refactoring-expert.md** - Expertise refactorisation ⭐
7. **requirements-analyst.md** - Analyse exigences
8. **security-engineer.md** - Ingénierie sécurité
9. **system-architect.md** - Architecture système
10. **tech-stack-researcher.md** - Recherche stack techno
11. **technical-writer.md** - Rédaction technique

---

## 🎯 Agents HAUTEMENT RECOMMANDÉS pour ton projet

### 1. **frontend-architect.md** ⭐⭐⭐ (PRIORITÉ HAUTE)

**Pourquoi c'est PARFAIT pour ton projet** :

✅ **Accessibilité WCAG 2.1 AA** :
- Ton projet est patrimonial → Accessibilité obligatoire (service public)
- Tu as déjà des ARIA labels, mais cet agent peut auditer et améliorer
- Navigation clavier (Tab, flèches) déjà implémentée, peut être optimisée

✅ **Performance Core Web Vitals** :
- Tu as Mapbox GL JS (lourd) + react-map-gl + images historiques
- Cet agent peut optimiser le bundle size et le LCP/FID
- Déjà un bon travail fait (108 kB First Load), mais peut aller plus loin

✅ **Architecture composants réutilisables** :
- Tu as déjà `ImageComparisonSlider`, `DirectionalArrow`, `PointModal`
- Cet agent peut auditer l'architecture et suggérer des améliorations
- Peut identifier des patterns de composition manquants

✅ **Mobile-first responsive** :
- Ton projet a des formats portrait/paysage adaptatifs (récent)
- Cet agent peut tester sur tous les devices et optimiser touch events
- UX "mamie ivre" friendly = forte demande d'accessibilité mobile

**Cas d'usage concrets** :
```
Prompt : "Audite l'accessibilité WCAG 2.1 AA de la modal PointModal"
Prompt : "Optimise les Core Web Vitals (LCP < 2.5s, FID < 100ms)"
Prompt : "Analyse l'architecture des composants map/ et modal/"
Prompt : "Teste l'UX mobile sur iPhone SE et iPad"
```

**ROI estimé** : 🚀🚀🚀 **TRÈS ÉLEVÉ** (aligné à 90% avec tes besoins)

---

### 2. **performance-engineer.md** ⭐⭐⭐ (PRIORITÉ HAUTE)

**Pourquoi c'est ESSENTIEL pour ton projet** :

✅ **Contrainte critique : GPU Memory < 320 MB** :
- Tu as documenté ce problème dans `CRASH_ANALYSIS_REPORT.md`
- Cet agent peut profiler et identifier les memory leaks Mapbox
- "Measure first, optimize second" = approche parfaite pour ton cas

✅ **Performance 60 FPS minimum** :
- Tu as déjà fait du throttling (flèche 60 FPS)
- Cet agent peut analyser tous les chemins critiques (rotation carte, hover, etc.)
- Peut identifier des optimisations GPU manquées

✅ **Optimisation bundle size** :
- Actuellement 108 kB First Load JS
- Cet agent peut identifier quels chunks peuvent être lazy-loadés
- Peut analyser si `react-compare-slider` (8kb) peut être optimisé

✅ **Backend API performance** (Street View Static API) :
- Tu fais 4 requêtes Street View par ouverture de modal
- Cet agent peut suggérer du caching/CDN
- Peut analyser si tu dépasses les quotas Google

**Cas d'usage concrets** :
```
Prompt : "Profile la mémoire GPU pendant rotation 3D + bâtiments"
Prompt : "Analyse les bottlenecks 60 FPS sur mobile"
Prompt : "Optimise le bundle size (lazy loading images)"
Prompt : "Stratégie de caching pour Street View Static API"
```

**ROI estimé** : 🚀🚀🚀 **TRÈS ÉLEVÉ** (résout tes problèmes de crash GPU)

---

### 3. **refactoring-expert.md** ⭐⭐ (PRIORITÉ MOYENNE)

**Pourquoi c'est UTILE (mais moins urgent)** :

✅ **Simplifier sans casser** :
- Tu as ~900 lignes dans `InteractiveMap.tsx` (état global complexe)
- Cet agent peut refactoriser par petits incréments sécurisés
- "Zéro modification comportement externe" = parfait pour un projet stable

✅ **Réduction dette technique** :
- Tu as supprimé Turf.js récemment (bon exemple)
- Cet agent peut identifier d'autres dépendances inutiles
- Peut simplifier les hooks complexes (useCallback, useMemo)

✅ **Application SOLID** :
- Ton code est déjà bien structuré, mais peut être amélioré
- Cet agent peut séparer les responsabilités (map logic vs UI logic)
- Peut extraire des custom hooks réutilisables

⚠️ **MAIS** : Moins prioritaire que frontend-architect et performance-engineer car ton code est déjà de bonne qualité.

**Cas d'usage concrets** :
```
Prompt : "Refactorise InteractiveMap.tsx (900 lignes → composants)"
Prompt : "Analyse la complexité cyclomatique de handleMapMove"
Prompt : "Extraire custom hooks de InteractiveMap (useMapBearing, useActiveArrow)"
```

**ROI estimé** : 🚀🚀 **MOYEN-ÉLEVÉ** (améliore maintenabilité long-terme)

---

## ⚠️ Agents MOINS RECOMMANDÉS (pour l'instant)

### 4. **security-engineer.md** ⭐ (PRIORITÉ BASSE)

**Pourquoi c'est moins urgent** :
- Tu as déjà un bon CSP (Content Security Policy) dans `next.config.mjs`
- Clé API Google exposée déjà corrigée (commit 594f32b)
- Projet frontend statique → Surface d'attaque limitée

**Quand l'utiliser** :
- Si tu ajoutes un backend API
- Si tu stockes des données utilisateurs
- Avant mise en production publique (audit sécurité)

---

### 5. **backend-architect.md** ❌ (NON RECOMMANDÉ)

**Pourquoi** :
- Ton projet est 100% frontend (Next.js statique)
- Pas de base de données
- Pas d'API backend custom (seulement Google APIs externes)

**Quand l'utiliser** :
- Si tu ajoutes un système de commentaires utilisateurs
- Si tu crées une API pour gérer les POIs dynamiquement

---

### 6. **system-architect.md** ❌ (NON RECOMMANDÉ)

**Pourquoi** :
- Ton architecture est déjà bien définie (Next.js + Mapbox + React)
- Projet de taille moyenne (4 POIs, ~10 composants)
- Pas de microservices ou architecture distribuée

---

### 7. **tech-stack-researcher.md** ❌ (NON RECOMMANDÉ)

**Pourquoi** :
- Ta stack est déjà choisie et stable (Next.js 14, React 18, Mapbox GL JS 3)
- Pas de besoin de migration ou remplacement de techno

---

### 8. **requirements-analyst.md** ⚠️ (UTILITÉ LIMITÉE)

**Pourquoi** :
- Tes besoins sont déjà bien documentés (handoff, guides, etc.)
- Projet patrimonial = exigences stables (pas de changements fréquents)

**Quand l'utiliser** :
- Si tu ajoutes de nouvelles fonctionnalités majeures (timeline, partage social)
- Si tu dois rédiger un cahier des charges pour validation client

---

### 9. **deep-research-agent.md** ⚠️ (UTILITÉ LIMITÉE)

**Pourquoi** :
- Tu n'as pas besoin de recherche académique approfondie
- Ton domaine est technique (dev web) pas recherche scientifique

---

### 10. **learning-guide.md** ⚠️ (UTILITÉ LIMITÉE)

**Pourquoi** :
- Utile si tu veux apprendre Mapbox GL JS en profondeur
- Mais tu sembles déjà compétent sur ta stack

---

### 11. **technical-writer.md** ⭐ (PRIORITÉ BASSE-MOYENNE)

**Pourquoi c'est utile mais pas urgent** :
- Tu as déjà une excellente documentation (handoffs, guides, etc.)
- Cet agent peut structurer une doc utilisateur finale
- Peut rédiger un README pour GitHub public

**Quand l'utiliser** :
- Pour créer une documentation utilisateur grand public
- Pour rédiger un guide d'installation/déploiement
- Si tu open-sources le projet

---

## 🎯 Plan d'action recommandé

### **Phase 1 : Performance & Accessibilité (MAINTENANT)** ⚡

**Agents à installer** :
1. **frontend-architect.md** → Audit accessibilité + optimisation composants
2. **performance-engineer.md** → Résolution crash GPU + optimisation 60 FPS

**Actions concrètes** :
```bash
# 1. Créer .claude/agents/ dans ton projet
mkdir -p .claude/agents

# 2. Copier les 2 agents prioritaires
curl -o .claude/agents/frontend-architect.md \
  https://raw.githubusercontent.com/edmund-io/edmunds-claude-code/main/.claude/agents/frontend-architect.md

curl -o .claude/agents/performance-engineer.md \
  https://raw.githubusercontent.com/edmund-io/edmunds-claude-code/main/.claude/agents/performance-engineer.md

# 3. Utiliser dans Claude Code
# Prompt : "/frontend-architect audite l'accessibilité de PointModal.tsx"
# Prompt : "/performance-engineer profile GPU memory pendant 3D"
```

**ROI attendu** :
- ✅ Accessibilité WCAG 2.1 AA validée
- ✅ Crash GPU résolu (mémoire < 320 MB)
- ✅ Performance 60 FPS garantie sur mobile
- ✅ Bundle size optimisé (< 100 kB ?)

---

### **Phase 2 : Refactorisation (PLUS TARD)** 🔧

**Agent à installer** :
- **refactoring-expert.md** → Simplification code + réduction dette technique

**Quand** :
- Après validation Phase 1
- Quand tu ajoutes de nouveaux POIs (scaling)
- Si `InteractiveMap.tsx` devient trop complexe

---

### **Phase 3 : Documentation publique (SI BESOIN)** 📚

**Agent à installer** :
- **technical-writer.md** → Rédaction README + guide utilisateur

**Quand** :
- Si tu open-sources le projet
- Si tu crées une landing page publique
- Si tu dois former des contributeurs externes

---

## 📊 Tableau comparatif (priorités)

| Agent | Utilité projet | Priorité | Timing | ROI |
|-------|----------------|----------|--------|-----|
| **frontend-architect** | ⭐⭐⭐ | HAUTE | **Maintenant** | 🚀🚀🚀 |
| **performance-engineer** | ⭐⭐⭐ | HAUTE | **Maintenant** | 🚀🚀🚀 |
| **refactoring-expert** | ⭐⭐ | MOYENNE | Plus tard | 🚀🚀 |
| **technical-writer** | ⭐ | BASSE | Si besoin | 🚀 |
| **security-engineer** | ⭐ | BASSE | Production | 🚀 |
| backend-architect | ❌ | Aucune | Jamais | - |
| system-architect | ❌ | Aucune | Jamais | - |
| tech-stack-researcher | ❌ | Aucune | Jamais | - |
| requirements-analyst | ⚠️ | Très basse | Si pivot | - |
| deep-research-agent | ⚠️ | Très basse | Jamais | - |
| learning-guide | ⚠️ | Très basse | Jamais | - |

---

## 🎓 Pourquoi ces recommandations ?

### **Alignement avec ton projet**

Ton projet est un **frontend patrimonial interactif** avec :
- ✅ Forte exigence d'accessibilité (service public)
- ✅ Contraintes de performance (GPU, 60 FPS, mobile)
- ✅ Stack frontend moderne (React, Next.js, Mapbox)
- ✅ Documentation déjà excellente

**Les 2 agents prioritaires** (frontend-architect + performance-engineer) couvrent **90%** de tes besoins critiques.

**Refactoring-expert** est un bonus pour maintenir la qualité long-terme.

**Les autres agents** ne sont pas alignés avec ta stack/besoins actuels.

---

## 🚀 Conclusion

### **Recommandation finale** :

**Installe SEULEMENT 2 agents pour commencer** :
1. ✅ **frontend-architect.md** (accessibilité + architecture composants)
2. ✅ **performance-engineer.md** (GPU memory + 60 FPS)

**Ne pas installer** (sauf besoin futur) :
- ❌ backend-architect, system-architect, tech-stack-researcher (pas d'utilité)
- ⚠️ refactoring-expert (utile mais pas urgent)
- ⚠️ technical-writer (utile si open-source)
- ⚠️ security-engineer (utile avant production publique)

**ROI maximal** : Focus sur les 2 agents qui résolvent tes problèmes critiques actuels (accessibilité + performance).

**Évolutivité** : Tu peux ajouter d'autres agents plus tard si les besoins changent.

---

**Prêt à installer les 2 agents prioritaires ?** 🚀
