@echo off
TITLE VinnPro AI Education OS Launcher
echo =======================================================
echo    Starting VinnPro AI Education OS (Flask + React)
echo =======================================================
echo.

echo [1/2] Starting Flask Backend on http://localhost:5000 ...
start "VinnPro Backend (Flask)" cmd /k "cd backend && python app.py"

echo [2/2] Starting React Frontend on http://localhost:5173 ...
start "VinnPro Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo =======================================================
echo  Platform is starting up!
echo  Frontend URL: http://localhost:5173
echo  Backend API:  http://localhost:5000/api
echo.
echo  Demo Credentials:
echo    Admin:   admin@vinnpro.com   / Admin@123
echo    Teacher: teacher@vinnpro.com / Teacher@123
echo    Student: student@vinnpro.com / Student@123
echo =======================================================
pause
