@echo off
title Emulator Adonis Android
set "ANDROID_AVD_HOME=D:\Android\avd"
echo Uruchamianie zoptymalizowanego emulatora Adonis...
start "" "%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe" -avd medium_phone -no-boot-anim -memory 3584
exit

