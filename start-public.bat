@echo off
title BuildTrack - Public Server Startup
color 0A

echo.
echo  ========================================
echo   BuildTrack - Starting Public Access
echo  ========================================
echo.

:: Check if ngrok is installed

where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] ngrok not found in PATH.
    echo  Download from: https://ngrok.com/download
    pause
    exit /b 1
)

:: Kill any leftover processes
echo  [1/4] Cleaning up old processes...
taskkill /F /IM ngrok.exe >nul 2>&1

:: Start backend (if not already running on 5000)
netstat -ano | findstr ":5000 " | findstr LISTENING >nul 2>&1
if %errorlevel% neq 0 (
    echo  [2/4] Starting backend on port 5000...
    start "BuildTrack Backend" cmd /k "cd /d %~dp0server && npm run dev"
    timeout /t 4 /nobreak >nul
) else (
    echo  [2/4] Backend already running on port 5000. OK.
)

:: Start frontend with --host flag
echo  [3/4] Starting frontend on port 5173...
start "BuildTrack Frontend" cmd /k "cd /d %~dp0client && npm run dev -- --host"
timeout /t 5 /nobreak >nul

:: Start ngrok tunnel
echo  [4/4] Starting ngrok tunnel...
start "BuildTrack ngrok" cmd /k "ngrok http --domain=junkyard-automatic-riverboat.ngrok-free.dev 5173"
timeout /t 3 /nobreak >nul

echo.
echo  ========================================
echo   PUBLIC URL READY TO SHARE:
echo.
echo   https://junkyard-automatic-riverboat.ngrok-free.dev
echo.
echo   Share this URL with anyone on any network!
echo   They can access the full app with this link.
echo  ========================================
echo.
echo  Servers running in background windows.
echo  Close those windows to stop the servers.
echo.
pause
