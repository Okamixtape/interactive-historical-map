#!/bin/bash

# Script d'optimisation des images pour éviter les crashs mémoire
# Convertit les PNG lourds en JPEG optimisés

echo "🔍 Optimisation des images dans public/archives/"
echo ""

cd "$(dirname "$0")/.." || exit 1

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick n'est pas installé"
    echo "📦 Installation avec Homebrew :"
    echo "   brew install imagemagick"
    exit 1
fi

# Créer un backup
BACKUP_DIR="public/archives/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "💾 Backup des originaux dans : $BACKUP_DIR"
cp public/archives/*.png "$BACKUP_DIR/" 2>/dev/null || true

# Convertir les PNG en JPEG avec qualité 85
for file in public/archives/*.png; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .png)
        output="public/archives/${filename}.jpg"
        
        echo "🔄 Conversion : $(basename "$file")"
        echo "   Avant : $(du -h "$file" | cut -f1)"
        
        # Convertir avec qualité 85, resize si > 2000px de large
        convert "$file" \
            -resize '2000x2000>' \
            -quality 85 \
            -strip \
            "$output"
        
        echo "   Après : $(du -h "$output" | cut -f1)"
        echo "   ✅ Sauvegardé : $output"
        echo ""
    fi
done

echo "✨ Optimisation terminée !"
echo ""
echo "📊 Résumé :"
du -sh public/archives/*.{jpg,png} 2>/dev/null | sort -hr
