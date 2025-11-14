# Guide d'ajout de points d'intérêt

## Workflow complet

### Étape 1 : Préparer l'image d'archive

1. Télécharger l'image depuis les archives
2. Optimiser (compression, recadrage si nécessaire)
3. Renommer : `lieu-annee.jpg` (ex: `gare-1920.jpg`)
4. Placer dans `/public/archives/`

### Étape 2 : Localiser sur Street View

1. Ouvrir [Google Maps](https://maps.google.com)
2. Rechercher l'adresse exacte à Limoges
3. Activer Street View (bonhomme jaune)
4. Positionner la vue pour correspondre à la photo d'archive

### Étape 3 : Extraire les paramètres

#### Coordonnées GPS
- Clic droit sur le point → "Plus d'infos sur cet endroit"
- Format : `[longitude, latitude]` (attention à l'ordre !)
- Exemple : `[1.2611, 45.8312]`

#### Paramètres Street View (depuis l'URL)

URL exemple :
```
https://www.google.com/maps/@45.8312,1.2611,3a,75y,120h,85t/data=...
```

Extraction :
- **latitude** : `45.8312` (1er nombre après `@`)
- **longitude** : `1.2611` (2ème nombre)
- **heading** : `120` (nombre avant `h`) → Orientation horizontale 0-360°
- **pitch URL** : `85` (nombre avant `t`) → **⚠️ CONVERSION NÉCESSAIRE**
- **fov** : `75` (nombre avant `y`) → Champ de vision (optionnel, défaut 90)

**⚠️ IMPORTANT : Conversion du pitch**

Le pitch dans l'URL Google Maps est **inversé** par rapport à l'API Street View :

```
pitch_API = 90 - pitch_URL

Exemples :
- URL: 90t  → API: 0°  (horizontal, vue vers l'horizon)
- URL: 45t  → API: 45° (vue oblique vers le bas)
- URL: 0t   → API: 90° (vue vers le sol)
```

**Règle simple** : Si la vue pointe vers l'horizon (cas le plus fréquent), utilisez `pitch: 0` dans le JSON.

#### Paramètres Mapbox Camera (optionnel)

Pour une vue 3D immersive sur la carte :
- **bearing** : Même valeur que `heading` Street View
- **pitch** : 45-65° (vue oblique)
- **zoom** : 17-19 (très proche)

### Étape 4 : Remplir le JSON

Template à copier dans `data/points.json` :

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [LONGITUDE, LATITUDE]
  },
  "properties": {
    "id": "identifiant-unique",
    "title": "Nom du lieu",
    "address": "Adresse complète, 87000 Limoges",
    "category": "urbanisme|architecture|industrie|patrimoine-disparu",
    "description": "Description historique du lieu et de sa transformation.",
    "historical": {
      "year": 1920,
      "imageUrl": "/archives/nom-fichier.jpg",
      "source": "Archives Départementales Haute-Vienne",
      "archiveReference": "Cote d'archive (si disponible)"
    },
    "streetView": {
      "latitude": LATITUDE,
      "longitude": LONGITUDE,
      "heading": 120,
      "pitch": 10,
      "fov": 90
    },
    "mapboxCamera": {
      "bearing": 120,
      "pitch": 60,
      "zoom": 18,
      "duration": 3000
    },
    "tags": ["tag1", "tag2", "époque"]
  }
}
```

### Étape 5 : Catégories disponibles

- **`urbanisme`** 🏛️ : Rues, places, aménagements urbains
- **`architecture`** 🏗️ : Bâtiments remarquables, monuments
- **`industrie`** 🏭 : Usines, manufactures (ex: Haviland, porcelaine)
- **`patrimoine-disparu`** 🕰️ : Édifices détruits ou transformés

### Étape 6 : Validation

Avant de committer :

```bash
# Vérifier la syntaxe JSON
cat data/points.json | jq .

# Lancer l'app en dev
npm run dev

# Tester dans le navigateur
open http://localhost:3000
```

## Exemples de lieux patrimoniaux à Limoges

### Suggestions de points d'intérêt

1. **Gare des Bénédictins** (1929)
   - Architecture Art déco emblématique
   - Transformations intérieures

2. **Halles Centrales** (1885-1890)
   - Architecture métallique Baltard
   - Rénovations récentes

3. **Manufacture Haviland** (XIXe)
   - Patrimoine industriel porcelainier
   - Évolution du site

4. **Rue de la Boucherie** (médiévale)
   - Élargissement haussmannien 1893
   - Maisons à pans de bois

5. **Pont Saint-Martial** (1215, reconstruit)
   - Évolution du franchissement de la Vienne
   - Aménagements urbains

6. **Cathédrale Saint-Étienne**
   - Chantier médiéval (XIIIe-XVIe)
   - Restaurations XIXe

7. **Cour du Temple** (quartier médiéval)
   - Transformations urbaines
   - Patrimoine disparu

8. **Pavillon du Verdurier** (1919)
   - Architecture des années folles
   - État actuel

## Ressources archives Limoges

### Archives en ligne
- [Archives Haute-Vienne](https://archives.haute-vienne.fr/)
- [Gallica - Limoges](https://gallica.bnf.fr/services/engine/search/sru?operation=searchRetrieve&version=1.2&query=limoges)
- [Bibliothèque francophone multimédia](https://bfm.limoges.fr/)

### Fonds photographiques
- Fonds Léon Deshairs (début XXe)
- Fonds Roger Henrard (années 1950-1970)
- Cartes postales anciennes

### Cotes utiles Archives Départementales
- Série Fi : Fonds iconographiques
- Série O : Administration communale (travaux publics)
- Série M : Bâtiments publics

## Checklist par point

- [ ] Image d'archive téléchargée et optimisée
- [ ] Image placée dans `/public/archives/`
- [ ] Coordonnées GPS vérifiées
- [ ] Street View positionné correctement
- [ ] Paramètres `heading` et `pitch` extraits
- [ ] JSON validé (syntaxe correcte)
- [ ] Métadonnées complètes (source, année, description)
- [ ] Test visuel dans l'application
- [ ] Commit avec message descriptif
