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
    [ -f frontend/dist/pobierz.html ] && docker cp frontend/dist/pobierz.html adonis_frontend:/usr/share/nginx/html/pobierz.html || true
    [ -f frontend/nginx.conf ] && docker cp frontend/nginx.conf adonis_frontend:/etc/nginx/conf.d/default.conf || true
    # (stara linia cache-busting usunieta - juz niepotrzebna od v1.6)
    for img in frontend/dist/*.png frontend/dist/*.jpg frontend/dist/*.jpeg frontend/dist/*.svg frontend/dist/*.ico frontend/dist/*.webp; do
        if [ -f "$img" ]; then
            docker cp "$img" "adonis_frontend:/usr/share/nginx/html/$(basename "$img")" 2>/dev/null || true
        fi
    done
    for apk in frontend/dist/*.apk; do
        if [ -f "$apk" ]; then
            filename=$(basename "$apk")
            if [ "$filename" != "Adonis-fit-and-eat-v1.0.apk" ]; then
                echo "Kopiowanie APK: $filename"
                docker cp "$apk" "adonis_frontend:/usr/share/nginx/html/$filename" 2>/dev/null || true
            fi
        fi
    done
fi
for root_apk in *.apk; do
    if [ -f "$root_apk" ]; then
        filename=$(basename "$root_apk")
        if [ "$filename" != "Adonis-fit-and-eat-v1.0.apk" ]; then
            echo "Kopiowanie root APK: $filename"
            docker cp "$root_apk" "adonis_frontend:/usr/share/nginx/html/$filename" 2>/dev/null || true
        fi
    fi
done
docker restart adonis_frontend

echo '>> Gotowe! Serwisy Adonis zostały zaktualizowane.'
