# ⚙️ Guide de Configuration

Ce document vous guide pas à pas pour obtenir et configurer les clés API nécessaires au fonctionnement de l'application.

---

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Configuration Mapbox](#-configuration-mapbox)
- [Configuration Google Maps](#️-configuration-google-maps)
- [Variables d'environnement](#-variables-denvironnement)
- [Sécurisation des API keys](#-sécurisation-des-api-keys)
- [Vérification de la configuration](#-vérification-de-la-configuration)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Vue d'ensemble

L'application nécessite **2 clés API** :

| Service | API | Coût | Requis |
|---------|-----|------|--------|
| **Mapbox** | Mapbox GL JS | Gratuit jusqu'à 50k loads/mois | ✅ |
| **Google Maps** | Maps Embed API | Gratuit jusqu'à 28k loads/mois | ✅ |

> 💡 **Note** : Les deux services offrent des quotas gratuits largement suffisants pour un usage modéré.

---

## 🗺️ Configuration Mapbox

### Étape 1 : Créer un compte Mapbox

1. Rendez-vous sur [mapbox.com](https://www.mapbox.com/)
2. Cliquez sur **"Sign up"**
3. Créez votre compte (email + mot de passe)
4. Vérifiez votre email

### Étape 2 : Obtenir votre token public

1. Une fois connecté, allez sur votre [Dashboard](https://account.mapbox.com/)
2. Descendez jusqu'à la section **"Access tokens"**
3. Copiez le **"Default public token"**
   - Format : `pk.eyJ1Ijoi...`
   - Ce token est déjà créé par défaut

<details>
<summary>📸 Capture d'écran</summary>

```
┌─────────────────────────────────────┐
│ Access tokens                        │
├─────────────────────────────────────┤
│ Default public token                 │
│ pk.eyJ1IjoieW91cnVzZXJuYW1lIiw...   │
│ [📋 Copy]                            │
└─────────────────────────────────────┘
```
</details>

### Étape 3 : Configurer les restrictions d'URL (IMPORTANT 🔒)

> ⚠️ **Sécurité critique** : Sans restrictions, n'importe qui peut utiliser votre token et épuiser votre quota !

1. Sur votre Dashboard, trouvez votre **Default public token**
2. Cliquez sur le token pour voir ses détails
3. Descendez jusqu'à **"URL restrictions"**
4. Ajoutez les URLs autorisées :

```
# Développement local
http://localhost:3000/*
http://127.0.0.1:3000/*

# Production (remplacez par votre domaine)
https://votredomaine.com/*
https://*.vercel.app/*  (si déployé sur Vercel)
```

5. Cliquez sur **"Update token"**

<details>
<summary>📸 Exemple de configuration</summary>

```
┌─────────────────────────────────────────┐
│ URL restrictions                         │
├─────────────────────────────────────────┤
│ Allowed URLs:                            │
│ • http://localhost:3000/*                │
│ • https://carte-limoges.vercel.app/*     │
│                                          │
│ [+ Add URL]                              │
│ [Update token]                           │
└─────────────────────────────────────────┘
```
</details>

### Étape 4 : Vérifier les quotas

1. Dans votre Dashboard, allez dans **"Statistics"**
2. Vérifiez votre usage :
   - **Plan gratuit** : 50,000 map loads / mois
   - **Web loads** : Chaque visite de page compte pour 1 load

> 💡 **Astuce** : Activez les notifications pour être prévenu à 80% du quota

---

## 🗺️ Configuration Google Maps

### Étape 1 : Créer un compte Google Cloud

1. Rendez-vous sur [console.cloud.google.com](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google
3. Acceptez les conditions d'utilisation

### Étape 2 : Créer un projet

1. Cliquez sur le menu déroulant du projet (en haut à gauche)
2. Cliquez sur **"NEW PROJECT"**
3. Nommez votre projet : `carte-patrimoniale-limoges`
4. Cliquez sur **"CREATE"**
5. Attendez la création (quelques secondes)
6. Sélectionnez votre nouveau projet

<details>
<summary>📸 Navigation</summary>

```
┌────────────────────────────────────┐
│ Google Cloud Console                │
├────────────────────────────────────┤
│ [≡] Select a project ▼              │
│     ┌──────────────────────────┐   │
│     │ NEW PROJECT              │   │
│     │                          │   │
│     │ carte-patrimoniale-...   │   │
│     └──────────────────────────┘   │
└────────────────────────────────────┘
```
</details>

### Étape 3 : Activer l'API Maps Embed

1. Dans le menu (☰), allez dans **"APIs & Services" > "Library"**
2. Recherchez **"Maps Embed API"**
3. Cliquez sur le résultat
4. Cliquez sur **"ENABLE"**
5. Attendez l'activation (quelques secondes)

<details>
<summary>🔍 Trouver la bonne API</summary>

**API à activer** : **Maps Embed API**

⚠️ **Ne PAS activer** :
- ❌ Maps JavaScript API (payante)
- ❌ Maps Static API (différente)
- ❌ Street View Static API (différente)

✅ **Bonne API** : **Maps Embed API** (gratuite pour iframe)
</details>

### Étape 4 : Créer une clé API

1. Allez dans **"APIs & Services" > "Credentials"**
2. Cliquez sur **"+ CREATE CREDENTIALS"**
3. Sélectionnez **"API key"**
4. Une clé est générée automatiquement
   - Format : `AIzaSy...`
5. **IMPORTANT** : Cliquez immédiatement sur **"RESTRICT KEY"**

<details>
<summary>📸 Création de la clé</summary>

```
┌──────────────────────────────────────┐
│ API key created                       │
├──────────────────────────────────────┤
│ Your API key:                         │
│ AIzaSyD7fGh...                       │
│ [📋 Copy]                             │
│                                       │
│ ⚠️ RESTRICT KEY (recommended)         │
└──────────────────────────────────────┘
```
</details>

### Étape 5 : Restreindre la clé API (CRITIQUE 🔒)

> ⚠️ **ÉTAPE CRITIQUE** : Une clé non restreinte peut coûter des milliers d'euros si elle est volée !

#### A. Restrictions d'API

1. Dans **"API restrictions"**, sélectionnez **"Restrict key"**
2. Cochez **UNIQUEMENT** :
   - ✅ **Maps Embed API**
3. Cliquez sur **"OK"**

<details>
<summary>📸 Restrictions d'API</summary>

```
┌────────────────────────────────────┐
│ API restrictions                    │
├────────────────────────────────────┤
│ ◉ Restrict key                      │
│                                     │
│ Select APIs:                        │
│ ✅ Maps Embed API                   │
│ ☐ Maps JavaScript API               │
│ ☐ Places API                        │
│                                     │
│ [OK]                                │
└────────────────────────────────────┘
```
</details>

#### B. Restrictions de site web

1. Dans **"Application restrictions"**, sélectionnez **"HTTP referrers (web sites)"**
2. Cliquez sur **"+ ADD AN ITEM"**
3. Ajoutez vos URLs autorisées :

```
# Développement local
http://localhost:3000/*
http://127.0.0.1:3000/*

# Production (remplacez par votre domaine)
https://votredomaine.com/*
https://*.vercel.app/*
```

4. Cliquez sur **"DONE"**
5. Cliquez sur **"SAVE"**

<details>
<summary>📸 Restrictions de site web</summary>

```
┌───────────────────────────────────────┐
│ Application restrictions               │
├───────────────────────────────────────┤
│ ◉ HTTP referrers (web sites)          │
│                                        │
│ Website restrictions:                  │
│ 1. http://localhost:3000/*             │
│ 2. https://carte-limoges.vercel.app/*  │
│                                        │
│ [+ ADD AN ITEM]                        │
│ [SAVE]                                 │
└───────────────────────────────────────┘
```
</details>

### Étape 6 : Vérifier les quotas

1. Allez dans **"APIs & Services" > "Quotas"**
2. Sélectionnez **"Maps Embed API"**
3. Vérifiez :
   - **Quota gratuit** : 28,000 loads / mois
   - **Usage actuel** : Visible dans les graphiques

> 💡 **Astuce** : Configurez une alerte de budget à 0€ pour être notifié si la clé est compromise

<details>
<summary>🔔 Configurer une alerte de budget</summary>

1. Allez dans **"Billing" > "Budgets & alerts"**
2. Cliquez sur **"CREATE BUDGET"**
3. Budget mensuel : **$0** (zéro)
4. Alert threshold : **50%** (soit 14k loads)
5. Ajoutez votre email pour recevoir les alertes
6. Cliquez sur **"FINISH"**

**Pourquoi $0 ?** Le quota gratuit devrait suffire. Toute facturation signale un problème de sécurité.
</details>

---

## 🔐 Variables d'environnement

### Créer le fichier `.env.local`

À la racine du projet :

```bash
cp .env.example .env.local
```

### Éditer `.env.local`

Ouvrez le fichier et remplacez les valeurs :

```env
# MapBox Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiVOTREUSERNAME...
# ⬆️ Collez votre token Mapbox (commence par pk.)

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyD7fGh...
# ⬆️ Collez votre clé Google Maps (commence par AIza)
```

### Vérification du format

✅ **Format correct** :
```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoibXl1c2VybmFtZSIsImEiOiJjbHNkNmF...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDfGhJkLmN0PqRsTuVwXyZ1234567890
```

❌ **Format incorrect** :
```env
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ..."  # ❌ Pas de guillemets
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here  # ❌ Placeholder non remplacé
NEXT_PUBLIC_MAPBOX_TOKEN=  # ❌ Vide
```

---

## 🔒 Sécurisation des API keys

### Checklist de sécurité

- [ ] **Mapbox** : Restrictions d'URL configurées
- [ ] **Google Maps** : Restrictions d'URL configurées
- [ ] **Google Maps** : Restriction aux APIs (uniquement Maps Embed API)
- [ ] **Google Maps** : Alerte de budget à $0 configurée
- [ ] `.env.local` dans `.gitignore` (déjà fait ✅)
- [ ] Pas de commit de `.env.local` sur Git
- [ ] Variables configurées sur Vercel (pour production)

### Bonnes pratiques

#### ✅ À FAIRE

- ✅ Utiliser des restrictions d'URL strictes
- ✅ Configurer des alertes de quota
- ✅ Régénérer les clés si compromises
- ✅ Utiliser des clés différentes pour dev et prod (optionnel)
- ✅ Monitorer l'usage régulièrement

#### ❌ À NE PAS FAIRE

- ❌ Committer `.env.local` sur Git
- ❌ Partager les clés par email/Slack
- ❌ Utiliser les mêmes clés pour plusieurs projets
- ❌ Laisser les clés sans restrictions
- ❌ Ignorer les alertes de quota

### Que faire si une clé est compromise ?

1. **Immédiatement** : Supprimer la clé compromise
   - Mapbox : Dashboard > Access tokens > Delete
   - Google : Credentials > API key > Delete

2. **Créer une nouvelle clé** (suivre les étapes ci-dessus)

3. **Mettre à jour** `.env.local` et Vercel

4. **Analyser** : Vérifier l'usage suspect dans les dashboards

---

## ✅ Vérification de la configuration

### Test local

1. Lancez le serveur de développement :
```bash
npm run dev
```

2. Ouvrez [http://localhost:3000](http://localhost:3000)

3. Vérifiez :
   - ✅ La carte Mapbox s'affiche correctement
   - ✅ Les markers sont visibles
   - ✅ Cliquez sur un POI et ouvrez la modal
   - ✅ Street View s'affiche dans la partie droite

### Erreurs courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| Carte grise/vide | Token Mapbox invalide ou manquant | Vérifier `.env.local` |
| "API Google Maps non configurée" | Clé Google Maps manquante | Vérifier `.env.local` |
| 403 Forbidden (Mapbox) | URL non autorisée | Ajouter `localhost:3000` aux restrictions |
| 403 Forbidden (Google) | Referrer bloqué | Ajouter `localhost:3000` aux restrictions |
| Quota dépassé | Trop de requêtes | Vérifier les dashboards |

### Tester les restrictions d'URL

1. **Test Mapbox** :
```bash
# Dans la console du navigateur (F12)
console.log(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)
# Devrait afficher : pk.eyJ...
```

2. **Test Google Maps** :
```bash
# Ouvrir la modal d'un POI
# Inspector l'iframe Street View
# L'URL devrait contenir : key=AIza...
```

---

## 🔧 Troubleshooting

### Mapbox ne s'affiche pas

<details>
<summary>🔍 Diagnostic</summary>

**Symptôme** : Carte grise ou erreur console

**Solutions** :

1. Vérifier que le token commence par `pk.`
```bash
echo $NEXT_PUBLIC_MAPBOX_TOKEN
# Devrait afficher: pk.eyJ...
```

2. Vérifier les restrictions d'URL
   - Dashboard Mapbox > Token details > URL restrictions
   - Doit contenir : `http://localhost:3000/*`

3. Vérifier la console du navigateur (F12)
```
Error: 401 Unauthorized
→ Token invalide ou restreint
```

4. Redémarrer le serveur après modification de `.env.local`
```bash
# Ctrl+C pour arrêter
npm run dev  # Relancer
```
</details>

### Google Street View ne s'affiche pas

<details>
<summary>🔍 Diagnostic</summary>

**Symptôme** : Message "API Google Maps non configurée" ou iframe vide

**Solutions** :

1. Vérifier que la clé commence par `AIza`
```bash
echo $NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# Devrait afficher: AIzaSy...
```

2. Vérifier que l'API Maps Embed est activée
   - Google Cloud Console > APIs & Services > Dashboard
   - Chercher "Maps Embed API" → statut "Enabled"

3. Vérifier les restrictions
   - Credentials > API key > Edit
   - Application restrictions : HTTP referrers
   - API restrictions : Maps Embed API uniquement

4. Vérifier les erreurs 403 dans la console
```
Error 403: Forbidden
→ URL non autorisée dans les restrictions
```
</details>

### Variables d'environnement non chargées

<details>
<summary>🔍 Diagnostic</summary>

**Symptôme** : `undefined` ou valeurs vides

**Solutions** :

1. Vérifier le nom du fichier : `.env.local` (pas `.env`)

2. Vérifier qu'il est à la racine du projet
```bash
ls -la | grep .env
# Devrait afficher: .env.local
```

3. Pas d'espaces autour du `=`
```env
# ✅ Correct
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...

# ❌ Incorrect
NEXT_PUBLIC_MAPBOX_TOKEN = pk.eyJ...
```

4. Redémarrer le serveur (obligatoire après modification)
```bash
npm run dev
```
</details>

---

## 📞 Support

Besoin d'aide ? Consultez :

- 📖 [Documentation Mapbox](https://docs.mapbox.com/)
- 📖 [Documentation Google Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started)
- 🐛 [Issues GitHub](https://github.com/Okamixtape/interactive-historical-map/issues)

---

<div align="center">

**Configuration terminée !** Passez à l'étape suivante : [DEPLOYMENT.md](DEPLOYMENT.md)

[⬆ Retour en haut](#️-guide-de-configuration)

</div>
