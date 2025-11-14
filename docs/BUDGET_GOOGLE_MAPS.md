# Guide de Gestion du Budget Google Maps API

## Crédit Gratuit Mensuel

Google Maps Platform offre **200 USD de crédit gratuit par mois**, ce qui équivaut à :

- **28 000 chargements** de Maps JavaScript API (carte dynamique)
- **28 000 chargements** de Street View Static API
- **40 000 chargements** de Maps Embed API (iframe)

**Source** : [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)

## Configuration des Alertes Budgétaires

### 1. Accéder à la facturation

1. Google Cloud Console → **Facturation** (Billing)
2. Sélectionnez votre compte de facturation
3. **Budgets et alertes** → **Créer un budget**

### 2. Paramètres recommandés

```
Nom : "Alerte Maps API - Développement"
Projets : limoges-interactive-map
Budget mensuel : 5 USD
Alertes :
  - 50% (2.50 USD) → Email
  - 90% (4.50 USD) → Email
  - 100% (5.00 USD) → Email + arrêt optionnel
```

### 3. Activer les notifications

- Cochez **"Envoyer des alertes par e-mail"**
- Ajoutez votre adresse email
- (Optionnel) Configurez un webhook pour arrêter automatiquement l'API

## Estimation de Consommation

### Scénario : Site de portfolio/démo

**Hypothèses** :
- 100 visiteurs uniques/mois
- 3 pages vues/visiteur
- 2 points d'intérêt consultés/session

**Calcul** :
```
Chargements de carte : 100 × 3 = 300 chargements/mois
Street View : 100 × 2 = 200 chargements/mois
Total : 500 chargements/mois

Coût estimé : ~0.03 USD/mois (bien en dessous des 200 USD gratuits)
```

### Scénario : Production avec trafic modéré

**Hypothèses** :
- 1 000 visiteurs/mois
- 5 pages vues/visiteur
- 3 comparaisons Street View/session

**Calcul** :
```
Chargements de carte : 1 000 × 5 = 5 000 chargements/mois
Street View : 1 000 × 3 = 3 000 chargements/mois
Total : 8 000 chargements/mois

Coût estimé : ~0.50 USD/mois (toujours gratuit)
```

## Optimisations Déjà Implémentées

### 1. Lazy Loading
```tsx
<iframe loading="lazy" />
```
→ Street View ne charge que lorsque visible à l'écran

### 2. Modal conditionnel
```tsx
{selectedPoint && <PointModal />}
```
→ Street View ne charge que si l'utilisateur clique sur un point

### 3. Pas de polling/refresh automatique
→ Pas de rechargement inutile des vues

## Optimisations Supplémentaires (si nécessaire)

### 1. Limiter le nombre de points affichés

```tsx
// Afficher max 50 points simultanément
const visiblePoints = points.slice(0, 50);
```

### 2. Cache côté client

```tsx
// Mémoriser les vues déjà chargées
const [cachedViews, setCachedViews] = useState<Map<string, string>>(new Map());
```

### 3. Utiliser des images statiques pour la preview

Au lieu de charger Street View immédiatement, afficher d'abord une image statique :

```tsx
// Street View Static API (moins cher que l'iframe)
const staticUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&key=${apiKey}`;
```

## Monitoring de la Consommation

### Tableau de bord Google Cloud

1. **APIs & Services** → **Tableau de bord**
2. Sélectionnez **Maps JavaScript API** et **Street View Static API**
3. Consultez les graphiques de requêtes quotidiennes

### Commande pour vérifier l'utilisation

```bash
gcloud monitoring time-series list \
  --filter='metric.type="serviceruntime.googleapis.com/api/request_count"' \
  --project=limoges-interactive-map
```

## Que Faire en Cas de Dépassement ?

### Si vous approchez des 200 USD gratuits :

1. **Analyser les logs** : Identifiez les requêtes excessives
2. **Activer le cache** : Implémentez un cache Redis/Vercel KV
3. **Limiter les fonctionnalités** : Désactivez temporairement certaines vues
4. **Passer à une alternative** : Mapbox Street View (si disponible)

### Arrêt automatique (sécurité maximale)

Configurez une fonction Cloud pour désactiver l'API si le budget dépasse 10 USD :

```javascript
// Cloud Function (optionnel)
exports.stopAPIOnBudget = functions.pubsub
  .topic('budget-alerts')
  .onPublish(async (message) => {
    const budgetAmount = message.json.costAmount;
    if (budgetAmount > 10) {
      // Désactiver l'API
      await disableAPI('maps-backend.googleapis.com');
    }
  });
```

## Checklist de Sécurité Budgétaire

- [x] Crédit gratuit de 200 USD/mois activé
- [ ] Alerte budgétaire configurée à 5 USD
- [ ] Restrictions d'API activées (Sites Web uniquement)
- [ ] Restrictions de domaine configurées (localhost + production)
- [x] Lazy loading implémenté
- [x] Chargement conditionnel (modal)
- [ ] Monitoring hebdomadaire de la consommation

## Ressources

- [Google Maps Platform Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [Documentation Budget Alerts](https://cloud.google.com/billing/docs/how-to/budgets)
- [API Usage Limits](https://developers.google.com/maps/documentation/javascript/usage-and-billing)
