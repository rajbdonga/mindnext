@echo off
title MindNext WhatsApp Background Gateway Server
color 0A
echo ======================================================================
echo          MINDNEXT WHATSAPP BACKGROUND GATEWAY (ZERO-TAB AUTO)
echo ======================================================================
echo.
echo Starting local backend server on http://localhost:3001 ...
echo This will allow mindnext.in/marketing to send auto messages in background
echo WITHOUT opening any browser tabs or getting blocked!
echo.
cd /d "%~dp0whatsapp-gateway"
node server.js
pause
