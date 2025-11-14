# Suivi d'Implémentation - Carte Interactive Limoges

## 📊 État Actuel du Projet

### ✅ Fonctionnalités Opérationnelles
- **3 POI réels** avec images d'archives authentiques
  - Pont Saint-Étienne (1862)
  - Pont Saint-Étienne - L'Abbessaille (1914)
  - Cathédrale Saint-Étienne - Abside (1900)
- **Sidebar** : Navigation avec header intégré, filtres, liste POI
- **Filtres synchronisés** : Sidebar + Carte (marqueurs cachés si filtrés)
- **Carte Mapbox** : Marqueurs cliquables avec fond blanc + bordure
- **Popup** : S'affiche au-dessus du marqueur (offset: 56px)
- **Modal** : Comparaison archives/Street View fonctionnelle
- **Légende** : Bas droite (toujours visible)
- **Style rétro subtil** : Palette vintage, typographie serif, bordures dorées
- **Types TypeScript** : `mapboxCamera` déjà implémenté

### ⚠️ Problèmes Identifiés et Résolus

#### 1. **Bug de centrage automatique (RÉSOLU)**
**Symptôme** : Clic sur marqueur → zoom aberrant sur Avenue de Locarno
**Cause** : Calcul `project/unproject` avec offset créait des coordonnées invalides
**Solution** : ✅ Suppression du flyTo automatique au clic marqueur
**Décision** : Garder le comportement simple (popup uniquement)

#### 2. **Popup au clic marqueur**
**État** : Fonctionne correctement ✅
**Comportement** : Clic → Popup s'affiche (pas de centrage automatique)

---

## 🎯 Plan d'Action Priorisé

### **Phase 1 : Amélioration UX (Semaine 1)**

#### ❌ Tâche 0 : Centrage automatique (ANNULÉ)
**Priorité** : HAUTE → ANNULÉ
**Objectif Initial** : Centrer automatiquement sur le marqueur cliqué

**Problème Rencontré** :
- Calcul `project/unproject` avec offset créait des coordonnées aberrantes
- Zoom sur Avenue de Locarno au lieu du marqueur
- Comportement instable

**Décision** :
- ✅ **Suppression du flyTo automatique** au clic marqueur
- ✅ **Comportement simple** : Clic → Popup uniquement
- ⏸️ **Report** : Le flyTo sera implémenté via la sidebar (Tâche 4)

**Raison** :
Le centrage automatique sera géré par la sidebar avec des paramètres `mapboxCamera` calibrés manuellement pour chaque POI, garantissant un comportement prévisible.

---

#### ⏸️ Tâche 1 : Types TypeScript
**Statut** : ✅ DÉJÀ FAIT
**Fichier** : `lib/types.ts`
**Note** : `mapboxCamera` déjà présent dans l'interface

---

#### ✅ Tâche 2 : Sidebar UI + Filtres Synchronisés (TERMINÉ)
**Priorité** : HAUTE
**Fichiers** : 
- `components/layout/Sidebar.tsx` (créé)
- `app/page.tsx` (modifié)

**Fonctionnalités Implémentées** :
- ✅ **Header intégré** : Titre + baseline dans la sidebar
- ✅ **Filtres catégories** : 5 boutons avec compteurs dynamiques
- ✅ **Filtres synchronisés** : Sidebar + Carte (marqueurs cachés si filtrés)
- ✅ **Liste POI** : Cards avec thumbnail aspect ratio 4:3
- ✅ **Toggle** : Bouton flèche inversée (← ouverte, → fermée)
- ✅ **Responsive** : 320px desktop, overlay mobile
- ✅ **Catégories vides** : Grisées et non cliquables
- ✅ **Style rétro subtil** : Palette vintage, typographie serif, bordures dorées

**Structure** :
```
Sidebar (320px desktop)
├── Header (bordeaux + crème, serif)
├── Filtres (5 catégories, bordures dorées)
├── Liste POI (scrollable, cards vintage)
└── Footer (crème, italic serif)
```

**Validation** :
- ✅ Composant compile sans erreur TypeScript
- ✅ Toggle fonctionne (flèche inversée)
- ✅ Les 3 POI s'affichent avec thumbnails
- ✅ Filtres synchronisés sidebar + carte
- ✅ Design rétro cohérent avec thème patrimoine

---

#### 🔗 Tâche 3 : Refactorisation Map (Prompt 6 MODIFIÉ)
**Priorité** : HAUTE
**Fichier** : `components/map/InteractiveMap.tsx` (à modifier)

**⚠️ MODIFICATIONS CRITIQUES** :
- ❌ **NE PAS** supprimer la popup actuelle
- ✅ **AJOUTER** forwardRef pour exposer `getMap()`
- ✅ **GARDER** le comportement actuel (popup au clic)
- ✅ **AJOUTER** support pour appel externe via ref

**Architecture cible** :
```typescript
interface InteractiveMapRef {
  getMap: () => mapboxgl.Map | undefined;
  flyToPoint: (poiId: string) => void; // Helper optionnel
}

const InteractiveMap = forwardRef<InteractiveMapRef, Props>((props, ref) => {
  // Exposer l'instance map via ref
  // GARDER la popup existante
});
```

**Validation** :
- [ ] Aucune erreur de compilation
- [ ] Popup fonctionne toujours au clic marqueur
- [ ] `mapRef.current.getMap()` retourne l'instance Mapbox
- [ ] Marqueurs et légende inchangés

---

#### 🎯 Tâche 4 : Intégration Sidebar ↔ Map (Prompt 7 MODIFIÉ)
**Priorité** : HAUTE
**Fichier** : `app/page.tsx` (à modifier)

**⚠️ MODIFICATIONS CRITIQUES** :
- ❌ **NE PAS** attendre la fin de flyTo pour ouvrir le modal
- ✅ **OUVRIR** le modal immédiatement après déclenchement flyTo
- ✅ Animation flyTo en parallèle de l'ouverture modal

**Handler cible** :
```typescript
const handlePOISelect = useCallback((poiId: string) => {
  const point = points.find(p => p.properties.id === poiId);
  if (!point) return;

  const map = mapRef.current?.getMap();
  if (map) {
    const [lng, lat] = point.geometry.coordinates;
    map.flyTo({
      center: [lng, lat],
      zoom: 17,
      duration: 2000, // À ajuster selon Tâche 0
      essential: true
    });
  }

  // Ouvrir immédiatement (pas de setTimeout)
  setSelectedPoint(point);
}, [points]);
```

**Validation** :
- [ ] Clic sidebar → flyTo + modal s'ouvre
- [ ] Clic marqueur → popup (comportement actuel préservé)
- [ ] Pas de délai artificiel avant modal
- [ ] Animation fluide

---

#### 🎨 Tâche 5 : Filtrage Sidebar (Prompt 5 - OPTIONNEL)
**Priorité** : MOYENNE
**Fichier** : `components/layout/Sidebar.tsx` (à modifier)

**Simplifications** :
- Filtres actifs : "Tous", "Urbanisme", "Architecture"
- Filtres grisés : "Industrie", "Patrimoine disparu"
- Badge de comptage : (3), (2), (1), (0), (0)

**Validation** :
- [ ] Cliquer sur "🏛️" affiche 2 POI
- [ ] Cliquer sur "🏗️" affiche 1 POI
- [ ] Cliquer sur "Tous" réaffiche les 3 POI
- [ ] Filtres vides sont grisés et non cliquables

---

## 📋 Checklist de Validation Phase 1

### ✅ Phase 1 Complétée !
- ✅ Tâche 0 : Annulée (flyTo via sidebar à venir)
- ✅ Tâche 1 : Types TypeScript (déjà fait)
- ✅ Tâche 2 : Sidebar créée et fonctionnelle
- ✅ Filtres synchronisés sidebar ↔ carte
- ✅ Style rétro subtil appliqué
- ✅ Légende déplacée en bas droite
- ⏸️ Tâche 3 : Map refactorisée avec ref (OPTIONNEL - à faire si besoin flyTo)
- ⏸️ Tâche 4 : Intégration flyTo sidebar (OPTIONNEL - à faire si besoin)
- ⏸️ Tâche 5 : Filtrage (DÉJÀ FAIT dans Tâche 2)

### État Actuel
- ✅ Navigation intuitive avec sidebar
- ✅ Filtres fonctionnels
- ✅ Design cohérent et rétro
- ✅ Aucune régression sur fonctionnalités existantes

---

## 🚀 Phase 2 : Enrichissement Contenu (Semaine 2+)

### Objectif : Atteindre 8-10 POI Réels

#### Workflow d'Ajout de POI
1. **Recherche archives** (Archives Haute-Vienne)
2. **Localisation Street View** (coordonnées + paramètres)
3. **Optimisation images** (JPEG ~200KB)
4. **Ajout manuel** dans `data/points.json`
5. **Calibrage mapboxCamera** (bearing, pitch, zoom)
6. **Test** : Vérifier flyTo + modal

#### POI Candidats (À Confirmer)
- [ ] Gare des Bénédictins (architecture)
- [ ] Place de la République (urbanisme)
- [ ] Manufacture de porcelaine (industrie)
- [ ] Ancien théâtre (patrimoine-disparu)
- [ ] Pont Neuf (urbanisme)

---

## 📝 Notes Techniques

### Configuration Actuelle
- **Offset popup** : 56px (optimal pour marqueur 44px)
- **Zoom flyTo** : 17 (à confirmer)
- **Duration flyTo** : ? (à documenter après Tâche 0)
- **Marqueur** : Émoji 24px + padding 16px + border 4px = 44px

### Problèmes Connus
1. **Rechargement visuel flyTo** : En cours d'investigation (Tâche 0)
2. **Warnings Permissions-Policy** : Résolus avec meta tag

### Décisions Architecturales
- ✅ Garder la popup au clic marqueur
- ✅ Ajouter sidebar en complément (pas remplacement)
- ✅ Privilégier POI réels vs fictifs
- ✅ Itération progressive (3 → 8 → 12+ POI)

---

## 🔄 Historique des Modifications

### 2024-11-14
- ✅ Ajout de 3 POI réels avec archives authentiques
- ✅ Optimisation marqueurs (fond blanc + bordure)
- ✅ Centrage automatique avec flyTo
- ✅ Ajustement offset popup (15px → 56px)
- ⚠️ Identification problème rechargement flyTo
- 📝 Création de ce document de suivi

---

## 📚 Ressources

### Documentation
- [Mapbox flyTo API](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#flyto)
- [Guide ajout points](/docs/GUIDE_AJOUT_POINTS.md)
- [Archives Haute-Vienne](https://archives.haute-vienne.fr/)

### Fichiers Clés
- Types : `/lib/types.ts`
- Données : `/data/points.json`
- Carte : `/components/map/InteractiveMap.tsx`
- Page : `/app/page.tsx`
- Archives : `/public/archives/`
