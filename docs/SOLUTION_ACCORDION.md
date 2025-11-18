# 🎯 Solution 2 : Accordion (si Solution 1 échoue)

## Concept

**Au lieu de** : Afficher toutes les images en même temps  
**On fait** : Un seul POI ouvert à la fois (accordion)

---

## UX Proposée

```
📍 Place d'Aine                    [▼]
📍 Gare des Bénédictins            [▼]
📍 Pont Saint-Martial               [▲] ← OUVERT
   ┌─────────────────────────────┐
   │ 🖼️ Image archive 1920       │
   │                              │
   │ 📅 1920                      │
   │ 📍 Pont Saint-Martial        │
   │ [Voir comparaison →]         │
   └─────────────────────────────┘
📍 Usine Haviland                  [▼]
```

---

## Avantages

✅ **Garde les images archives** (votre UX principale)  
✅ **1 seule image en mémoire** à la fois  
✅ **Impossible de crasher** (charge mémoire minimale)  
✅ **UX claire** : Focus sur un POI  
✅ **Mobile-friendly** : Moins de scroll  

---

## Inconvénients

⚠️ **Pas d'aperçu visuel** de tous les POIs en même temps  
⚠️ **1 clic de plus** pour voir une image  

---

## Implémentation (5 minutes)

### État local

```tsx
const [openPOI, setOpenPOI] = useState<string | null>(null);

const togglePOI = (id: string) => {
  setOpenPOI(openPOI === id ? null : id);
};
```

### Render

```tsx
{filteredPoints.map((point) => {
  const isOpen = openPOI === point.properties.id;
  
  return (
    <li key={point.properties.id}>
      {/* Header (toujours visible) */}
      <button onClick={() => togglePOI(point.properties.id)}>
        <span>{category?.emoji}</span>
        <span>{point.properties.title}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {/* Content (seulement si ouvert) */}
      {isOpen && (
        <div>
          <Image src={point.properties.historical.imageUrl} />
          <p>{point.properties.historical.year}</p>
          <button onClick={() => onPOISelect(point.properties.id)}>
            Voir comparaison →
          </button>
        </div>
      )}
    </li>
  );
})}
```

---

## Variante : Ouvrir le premier par défaut

```tsx
const [openPOI, setOpenPOI] = useState<string | null>(
  filteredPoints[0]?.properties.id || null
);
```

Comme ça, l'utilisateur voit toujours une image au chargement.

---

## Alternative : Modal au clic

Si vous préférez garder la liste compacte :

```
📍 Place d'Aine               [Voir →]
📍 Gare des Bénédictins       [Voir →]
📍 Pont Saint-Martial         [Voir →]
📍 Usine Haviland             [Voir →]
```

Clic → Ouvre modal avec :
- Image archive (gauche)
- Street View (droite)
- Bouton "Voir sur la carte"

---

## Décision

**Testez d'abord Solution 1** (suppression hovers)

**Si ça ne suffit pas** → Je peux implémenter l'accordion en 5 minutes

Dites-moi ce que vous préférez ! 🎯
