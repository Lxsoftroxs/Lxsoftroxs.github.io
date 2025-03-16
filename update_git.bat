@echo off
cd C:\Users\pshaw\Desktop\Lxsoftroxs.github.io

REM Pull first to integrate any remote edits
git pull origin main

REM Run your Python conversion script
C:\Users\pshaw\AppData\Local\Programs\Python\Python313\python.exe C:\Users\pshaw\Desktop\log2html.py

REM Commit and push updated logs
git add .
git commit -m "Automated daily IRC logs update - %DATE%"
git push origin main