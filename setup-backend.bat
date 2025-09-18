@echo off
echo Setting up BMBP-Admin Backend for MongoDB integration...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install backend dependencies
echo 📦 Installing backend dependencies...
npm install express cors mongodb dotenv nodemon

if %errorlevel% equ 0 (
    echo ✅ Backend dependencies installed successfully
) else (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo 🎉 Setup complete! To start the backend server:
echo.
echo    node server.js
echo.
echo The backend will run on http://localhost:3001
echo Your React app will automatically connect to it.
echo.
echo Make sure your .env file contains the MongoDB connection string.
pause