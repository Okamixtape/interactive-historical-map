# 🔄 Handoff à Google Gemini - Analyse Application Next.js

## 📋 Contexte

Application : **Carte Patrimoniale Interactive de Limoges**
- Framework : Next.js 14.2.18 (App Router)
- React : 18.3.1
- Mapbox GL : 3.16.0
- react-map-gl : 8.1.0

---

## ✅ Problèmes résolus (par Cascade)

### 1. Crash mémoire au scroll de la sidebar
**Cause** : `placeholder="blur"` avec images dynamiques + PNG non optimisés (10MB)
**Solution** :
- Conversion PNG → JPEG optimisés (-80% poids)
- Retrait `placeholder="blur"` 
- Réduction `quality` à 60 pour sidebar
- Désactivation React StrictMode

### 2. Incompatibilité React 19
**Cause** : react-map-gl@8.1.0 incompatible avec React 19
**Solution** : Downgrade React 19 → 18.3.1, Next.js 15 → 14.2.18

### 3. MapRef potentiellement instable
**Solution** : Ajout try/catch + vérification `typeof easeTo === 'function'`

---

## 🔍 MISSION POUR GEMINI

### Objectif principal
**Analyser l'application en profondeur et identifier TOUS les problèmes potentiels restants.**

### Zones à analyser en priorité

#### 1. **Performance et optimisation**
- [ ] Analyser le bundle size (trop gros ?)
- [ ] Vérifier les re-renders inutiles
- [ ] Identifier les memory leaks potentiels
- [ ] Analyser les dépendances non utilisées
- [ ] Vérifier la config Tailwind (purge CSS)

#### 2. **Architecture Next.js**
- [ ] Vérifier l'utilisation correcte de 'use client' vs Server Components
- [ ] Analyser la structure des dossiers (app/ vs pages/)
- [ ] Vérifier les metadata SEO
- [ ] Analyser les dynamic imports (code splitting)
- [ ] Vérifier la config next.config.mjs (optimisations manquantes ?)

#### 3. **Mapbox et react-map-gl**
- [ ] Vérifier les event listeners (memory leaks ?)
- [ ] Analyser la gestion des refs (MapRef)
- [ ] Vérifier les cleanup dans useEffect
- [ ] Analyser les performances de rendering des markers
- [ ] Vérifier la gestion des popups (z-index, overflow)

#### 4. **Gestion d'état**
- [ ] Analyser les useState/useMemo/useCallback
- [ ] Vérifier les dépendances des hooks
- [ ] Identifier les calculs redondants
- [ ] Vérifier la propagation des props

#### 5. **Images et assets**
- [ ] Vérifier que toutes les images utilisent next/image
- [ ] Analyser les sizes et quality configurés
- [ ] Vérifier le lazy loading
- [ ] Analyser le cache des images

#### 6. **Accessibilité et UX**
- [ ] Vérifier les aria-labels
- [ ] Analyser la navigation au clavier
- [ ] Vérifier les contrastes de couleurs
- [ ] Analyser le responsive design

#### 7. **Sécurité**
- [ ] Vérifier l'exposition des API keys
- [ ] Analyser les variables d'environnement
- [ ] Vérifier les CORS et CSP
- [ ] Analyser les dépendances vulnérables (npm audit)

#### 8. **Code quality**
- [ ] Identifier le code dupliqué
- [ ] Vérifier les types TypeScript (any, unknown)
- [ ] Analyser les erreurs ESLint ignorées
- [ ] Vérifier la cohérence du code style

---

## 📁 Structure actuelle

```
app/
├── layout.tsx          # RootLayout avec metadata
├── page.tsx            # HomePage ('use client')
└── globals.css         # Styles globaux + Mapbox overrides

components/
├── layout/
│   └── Sidebar.tsx     # Liste POIs avec filtres
├── map/
│   └── InteractiveMap.tsx  # Carte Mapbox + markers
└── modal/
    ├── PointModal.tsx      # Modal comparaison
    └── StreetViewEmbed.tsx # Google Street View iframe

data/
└── points.json         # GeoJSON FeatureCollection (4 POIs)

lib/
├── constants.ts        # Config Mapbox
└── types.ts            # Types TypeScript

public/
└── archives/           # Images historiques (JPEG optimisés)
```

---

## ⚠️ Points d'attention connus

### 1. Google Maps API
- Erreur 403 sur Street View Embed
- API Key présente mais restrictions URL à configurer
- Fichier : `components/modal/StreetViewEmbed.tsx`

### 2. Mapbox Token
- Token configuré dans `.env.local`
- URL restrictions doivent inclure `http://localhost:*`
- Erreur 403 si mal configuré (carte vide mais pas de crash)

### 3. Sidebar scroll
- Actuellement : tous les POIs rendus (même hors écran)
- Optimisation possible : virtualisation avec react-window
- Mais fonctionne correctement avec 4 POIs

### 4. Modal PointModal
- useEffect pour Escape key et body overflow
- Cleanup correct mais à vérifier
- Animation de fermeture avec setTimeout

---

## 🎯 Questions spécifiques pour Gemini

1. **Y a-t-il des anti-patterns React/Next.js dans le code ?**
2. **La config next.config.mjs est-elle optimale ?**
3. **Les images sont-elles correctement optimisées ?**
4. **Y a-t-il des risques de memory leaks ?**
5. **Le code est-il production-ready ?**
6. **Quelles sont les optimisations manquantes ?**
7. **Y a-t-il des problèmes de sécurité ?**
8. **Le bundle size peut-il être réduit ?**
9. **Les performances peuvent-elles être améliorées ?**
10. **Y a-t-il des bugs cachés potentiels ?**

---

## 📊 Métriques actuelles (après optimisations)

- **Bundle size** : Non mesuré
- **RAM utilisée** : ~300-500MB (au lieu de 4GB)
- **Images** : 2.2MB total (au lieu de 10.9MB)
- **Nombre de POIs** : 4 (extensible)
- **Temps de chargement** : Non mesuré
- **Lighthouse score** : Non mesuré

---

## 🚀 Prochaines étapes suggérées

1. **Mesurer les performances** (Lighthouse, Web Vitals)
2. **Ajouter des tests** (Jest, React Testing Library)
3. **Implémenter la virtualisation** si >20 POIs
4. **Optimiser le bundle** (tree shaking, code splitting)
5. **Ajouter le monitoring** (Sentry, Analytics)
6. **Configurer les API keys** correctement
7. **Améliorer l'accessibilité** (WCAG 2.1)
8. **Ajouter un système de cache** pour les images

---

## 📝 Notes importantes

- **Ne pas réactiver React StrictMode** sans résoudre les double renders
- **Ne pas utiliser `placeholder="blur"`** avec images dynamiques
- **Toujours utiliser `next/image`** pour les images
- **Vérifier les cleanup** dans tous les useEffect
- **Tester sur mobile** (responsive, touch events)

---

## 🔗 Ressources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Mapbox GL JS API](https://docs.mapbox.com/mapbox-gl-js/api/)
- [react-map-gl Documentation](https://visgl.github.io/react-map-gl/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

**Gemini, à toi de jouer ! Analyse tout et trouve ce qui peut être amélioré. Sois exhaustif et rigoureux.**

---

*Document généré le 15 novembre 2025 par Cascade*
*Commit : b25c3b2*
