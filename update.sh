#!/bin/bash
set -e
cd /home/slavosmm/app/adonis

echo '>> Pobieranie zmian z GitHub...'
git fetch origin main
git reset --hard origin/main

echo '>> Aktualizacja backendu (Django)...'
docker cp apps/. adonis_backend:/app/apps/
docker cp adonis_backend/. adonis_backend:/app/adonis_backend/
docker exec adonis_backend python manage.py migrate --noinput
docker restart adonis_backend

echo '>> Aktualizacja frontendu i APK...'
if [ -d 'frontend/dist' ]; then
    docker cp frontend/dist/. adonis_frontend:/usr/share/nginx/html/
fi
docker exec adonis_backend python manage.py seed_recipes
docker restart adonis_frontend

echo '>> Gotowe! Serwisy Adonis zostały zaktualizowane.'
