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
    docker cp frontend/dist/assets/. adonis_frontend:/usr/share/nginx/html/assets/
    docker cp frontend/dist/index.html adonis_frontend:/usr/share/nginx/html/index.html
    [ -f frontend/dist/app-icon.png ] && docker cp frontend/dist/app-icon.png adonis_frontend:/usr/share/nginx/html/app-icon.png
    [ -f frontend/dist/Adonis-fit-and-eat-v1.2.apk ] && docker cp frontend/dist/Adonis-fit-and-eat-v1.2.apk adonis_frontend:/usr/share/nginx/html/Adonis-fit-and-eat-v1.2.apk || true
    [ -f frontend/dist/Adonis-v1.2.apk ] && docker cp frontend/dist/Adonis-v1.2.apk adonis_frontend:/usr/share/nginx/html/Adonis-v1.2.apk || true
fi
docker restart adonis_frontend

echo '>> Gotowe! Serwisy Adonis zostały zaktualizowane.'
