@echo off
title MindNext WhatsApp Background Gateway Server
color 0A
echo ======================================================================
echo          MINDNEXT WHATSAPP BACKGROUND GATEWAY (ZERO-TAB AUTO)
echo ======================================================================
echo.
echo Starting local backend server on http://localhost:3001 ...
echo MongoDB Database Engine: ACTIVE (mongodb://127.0.0.1:27017/mindnext)
echo This will allow mindnext.in/marketing to send auto messages in background
echo and sync Admin Inquiries, Email Contacts, and File Transfers with MongoDB!
echo.
cd /d "%~dp0whatsapp-gateway"
node server.js
pause
