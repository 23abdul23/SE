# 📥 Installation Guide — Aegis ID

This document explains how to install and run the **Aegis ID** project on **Windows, macOS, and Linux**.  
It covers prerequisites, environment setup, backend + mobile app configuration, and common troubleshooting steps.

---

# 1️⃣ Prerequisites

Install these tools **before starting**:

## Core (All Operating Systems)
- **Node.js 18+** (includes npm)
- **Git**
- **Expo CLI** (`npm install -g expo-cli`)
- **MongoDB** (Local or Atlas)
- **Hardhat** (optional — blockchain features)

> Tip: Prefer Node.js **18 LTS** or newer.

---

# 2️⃣ OS-Specific Setup

## 🍏 macOS (zsh)
```zsh
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js & Git
brew install node git

# Global tools
npm install -g expo-cli hardhat

# MongoDB (optional local)
brew tap mongodb/brew
brew install mongodb-community
```

---

## 🐧 Linux

### Debian / Ubuntu
```bash
sudo apt update
sudo apt install -y curl git build-essential

# Install Node.js 20 (or switch to 18)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

sudo npm install -g expo-cli hardhat
```

### Arch Linux
```bash
sudo pacman -Syu --needed nodejs npm git base-devel
sudo npm install -g expo-cli hardhat
```

### Optional: Install via nvm
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 18
nvm use 18
```

---

## 🪟 Windows

### Option A: Native (PowerShell)
1. Install **Node.js 18+** from nodejs.org  
2. Install **Git for Windows**  
3. Install global tools:
```powershell
npm install -g expo-cli hardhat
```
4. Install **MongoDB Community Server** (optional local)

### Option B: WSL (Recommended)
1. Enable **WSL** and install Ubuntu  
2. Follow the **Debian/Ubuntu** installation steps above

---

# 3️⃣ Clone the Repository

```bash
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO>.git
cd <YOUR-REPO>
```

> ⚠️ Replace URL with your actual GitHub repository.

---

# 4️⃣ Install Project Dependencies

Inside the repo folder, run:

```bash
npm install
```

If errors occur:

```bash
npm install --legacy-peer-deps
# or
npm install --force
```

---

# 5️⃣ Environment Variables

Create a **`.env`** file at the project root:

```env
# Database
MONGODB_URI= mongodb://localhost:27017/aegis-id
MONGODB_URI_C= <mongo atlas cluster uri>

# Auth
JWT_SECRET=secret
JWT_EXPIRE=7d

# Backend
API_HOST=YOUR_LAPTOP_IP
PORT=3000
DATABASE=CLOUD   # or LOCAL

# Email
GMAIL_ID=aegisid777@gmail.com
GMAIL_PASSWORD=<your app password>

# Blockchain (if using Hardhat)
AMOY_RPC_URL=""
PRIVATE_KEY=""
```

➡️ **Never commit `.env` to GitHub.**  
➡️ Add `.env` to `.gitignore`.

---

# 6️⃣ Start the Backend Server

```bash
nodemon server.js
```

If nodemon is missing:

```bash
npm install -g nodemon
```

Expected output:

```
🚀 Aegis ID Backend running on port 3000
📦 MongoDB Connected
```

---

# 7️⃣ Start the Mobile App (Expo)

```bash
npx expo start
```

You will see a QR code in the terminal.

Scan using **Expo Go**:

- Android → Expo Go → Scan QR  
- iOS → Camera app → Scan QR → Open in Expo

---

# 8️⃣ Connect Your Phone to the Backend (Same WiFi Setup)

### Step 1 — Connect both **phone + laptop** to the same WiFi network

### Step 2 — Windows Users (Optional)  
Allow Node.js through firewall:

1. Windows Security → Firewall  
2. Allow an app → Add Node.js (`node.exe`)  
3. Enable **Private + Public** networks  

### Step 3 — Verify Backend is Reachable

On your **phone browser**, open:

```
http://YOUR_LAPTOP_IP:3000/api/health
```

You should see:

```json
{"status":"OK","message":"Aegis ID Backend is running"}
```

---

# 9️⃣ Common Commands

### Clear Expo cache
```bash
npx expo start -c
```

### Use tunnel for Expo (if QR not working)
```bash
npx expo start --tunnel
```

### Rebuild camera permissions
```bash
npx expo install expo-camera
```

---

# 🔧 Troubleshooting Guide

### ❌ **Network Error in the App**
Check backend:

```bash
curl http://localhost:3000/api/health
```

Check port usage:

```bash
netstat -an | findstr :3000   # Windows
sudo lsof -i :3000            # macOS/Linux
```

---

### ❌ **Cannot connect to backend via phone**
- Same WiFi?  
- Correct IP in `.env`?  
- Firewall allows Node.js?  
- Backend running?  

---

### ❌ **Expo QR Code Not Loading**
Try tunnel mode:

```bash
npx expo start --tunnel
```

---

### ❌ **MongoDB not connecting**
- Local MongoDB running?  
- Atlas IP whitelist correct?  
- URI correct in `.env`?  

---

# 🔐 Security Notes

- Never use your real wallet private key for development.
- Use testnets (Polygon Amoy).
- Use test Gmail accounts + App Passwords.
- Never commit credentials to Git.

Example `.env.example`:

```env
AMOY_RPC_URL=""
PRIVATE_KEY=""
MONGODB_URI=""
JWT_SECRET=""
GMAIL_ID=""
GMAIL_PASSWORD=""
```

---

# 🎉 You're Ready!

You can now run the **Aegis ID backend + Expo mobile app** successfully.

If you're stuck, contact **Abdul**  
(but don't call at 3 AM 😄).
