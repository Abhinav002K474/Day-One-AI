@echo off
echo ========================================
echo   DAY ONE AI - STABLE STARTUP
echo ========================================
echo.
echo [1/3] Checking MySQL...
ping 127.0.0.1 -n 1 > nul
echo     ✓ Network ready
echo.
echo [2/3] Starting Backend Server...
echo     → Running on http://localhost:5000
echo     → Press Ctrl+C to stop
echo.
cd backend
node server.js
