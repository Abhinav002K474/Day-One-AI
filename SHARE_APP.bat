@echo off
title Share App - Day One AI
cls
echo ===================================================
echo   MAKING YOUR APP ACCESSIBLE TO OTHERS
echo ===================================================
echo.
echo  1. Ensure your backend server is running (PM2 or Node).
echo  2. We are generating a public URL for Port 3000.
echo.
echo  > WAITING FOR PUBLIC URL...
echo.
echo  [NOTE] If asked for a "Tunnel Password":
echo  It is usually your public IP address.
echo  Visit https://loca.lt/mytunnelpassword to see it.
echo.
call npx localtunnel --port 3000
pause
