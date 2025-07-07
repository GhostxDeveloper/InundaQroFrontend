#!/bin/bash

echo "=== Script para revisar y resolver conflictos después del merge ==="
echo

# Verificar si estamos en medio de un merge
if [ -f .git/MERGE_HEAD ]; then
    echo "✓ Merge en progreso detectado"
    echo
    
    echo "Archivos con conflictos:"
    git status --porcelain | grep "^UU\|^AA\|^DD" || echo "No se detectaron conflictos activos"
    
    echo
    echo "Estado completo:"
    git status
    
    echo
    echo "PASOS PARA RESOLVER CONFLICTOS:"
    echo "1. Abre cada archivo con conflictos en tu editor"
    echo "2. Busca estas marcas:"
    echo "   <<<<<<< HEAD (tu código actual)"
    echo "   ======= (separador)"
    echo "   >>>>>>> ponceimplements (código de la otra rama)"
    echo "3. Decide qué código mantener"
    echo "4. Elimina las marcas (<<<<<<<, =======, >>>>>>>)"
    echo "5. Guarda el archivo"
    echo "6. Repite para todos los archivos"
    echo "7. Cuando termines todos los archivos:"
    echo "   git add ."
    echo "   git commit -m 'Resolviendo conflictos del merge'"
    echo
    
    echo "COMANDOS ÚTILES:"
    echo "- Ver archivos con conflictos: git status"
    echo "- Ver el contenido de un conflicto: git diff"
    echo "- Cancelar el merge: git merge --abort"
    echo "- Continuar después de resolver: git add . && git commit"
    
else
    echo "❌ No hay un merge en progreso"
    echo "Estado actual del repositorio:"
    git status
fi

echo
echo "=== Script de ayuda completado ==="
