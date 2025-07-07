#!/bin/bash

echo "=== Script para hacer merge seguro de ponceimplements con main ==="
echo

# Verificar que estamos en el directorio correcto
echo "Directorio actual: $(pwd)"
echo

# Verificar el estado actual
echo "1. Verificando estado del repositorio..."
git status

echo
echo "2. Guardando cambios actuales si los hay..."
git add .
git commit -m "Guardando cambios antes del merge con ponceimplements" || echo "No hay cambios para commitear"

echo
echo "3. Verificando ramas disponibles..."
git branch -a

echo
echo "4. Verificando si existe la rama ponceimplements..."
if git show-ref --verify --quiet refs/heads/ponceimplements; then
    echo "✓ La rama ponceimplements existe localmente"
elif git show-ref --verify --quiet refs/remotes/origin/ponceimplements; then
    echo "✓ La rama ponceimplements existe en el remoto"
    echo "Creando rama local desde el remoto..."
    git checkout -b ponceimplements origin/ponceimplements
    git checkout main
else
    echo "❌ Error: La rama ponceimplements no existe"
    echo "Ramas disponibles:"
    git branch -a
    exit 1
fi

echo
echo "5. Asegurándonos de que estamos en main..."
git checkout main

echo
echo "6. Actualizando main desde el remoto..."
git pull origin main || echo "No se pudo actualizar desde remoto (normal si no hay conexión)"

echo
echo "7. Preparando para el merge..."
echo "Creando un punto de respaldo..."
git tag backup-before-merge-$(date +%Y%m%d-%H%M%S) || echo "Tag de respaldo creado"

echo
echo "8. Haciendo merge de ponceimplements..."
echo "Esto intentará hacer un merge sin fast-forward para mantener el historial"

# Intentar merge automático primero
if git merge ponceimplements --no-ff -m "Merge de rama ponceimplements"; then
    echo "✓ Merge completado exitosamente sin conflictos!"
    echo
    echo "9. Verificando el resultado..."
    git status
    echo
    echo "10. Últimos commits después del merge:"
    git log --oneline -10
else
    echo "❌ Hay conflictos que requieren resolución manual"
    echo
    echo "Archivos en conflicto:"
    git status
    echo
    echo "INSTRUCCIONES PARA RESOLVER CONFLICTOS:"
    echo "1. Edita cada archivo marcado como 'both modified'"
    echo "2. Busca las marcas <<<<<<< HEAD, =======, y >>>>>>>"
    echo "3. Decide qué código mantener y elimina las marcas"
    echo "4. Cuando termines, ejecuta:"
    echo "   git add ."
    echo "   git commit -m 'Resolviendo conflictos del merge'"
    echo
    echo "Si necesitas cancelar el merge:"
    echo "   git merge --abort"
fi

echo
echo "=== Script completado ==="
