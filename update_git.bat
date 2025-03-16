@echo off
cd C:\Users\pshaw\Desktop\Lxsoftroxs.github.io

REM Fetch and merge remote changes first
git pull origin main

REM Copy converted HTML log from Desktop to repo logs folder
copy "C:\Users\pshaw\Desktop\Lxsoftblogcomments.html" ".\logs\Lxsoftblogcomments.html"

REM Add, commit, and push
git add .
git commit -m "Automated update of IRC log - %DATE%"
git push origin main
