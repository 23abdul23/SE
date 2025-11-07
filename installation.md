# Installation Guide — Aegis ID

This guide helps you set up and run **Aegis ID** on **macOS, Linux, and Windows**.  
You’ll install prerequisites, configure environment variables (without exposing secrets), and run the app.

---

## 1) Prerequisites

### Core tools (all OS)
- **Node.js 18+** (includes `npm`)
- **Git**
- **Expo CLI** (for React Native)
- **MongoDB** (local or Atlas)
- **Hardhat** (for smart contracts)

> Tip: Prefer **Node 18 LTS** or newer. Use a version manager when possible.

---

## 2) Install on Your OS

### macOS (zsh)
```zsh
# Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js (bundles npm)
brew install node

# Git
brew install git

# Expo CLI & Hardhat (global)
npm install -g expo-cli hardhat

# MongoDB (optional local)
brew tap mongodb/brew
brew install mongodb-community
```

### Linux

#### Debian/Ubuntu
```bash
sudo apt update
sudo apt install -y curl git build-essential

# Node via NodeSource (example for Node 20; use 18 if you prefer)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Expo CLI & Hardhat (global)
sudo npm install -g expo-cli hardhat

# MongoDB (optional local)
# Follow MongoDB’s official repo instructions for your distro
```

#### Arch Linux
```bash
sudo pacman -Syu --needed nodejs npm git base-devel
sudo npm install -g expo-cli hardhat
# MongoDB (community) is available as 'mongodb-bin' or via AUR; use your preferred method
```

> Alternative: Use **nvm** to manage Node versions on Linux/macOS:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# restart shell, then:
nvm install 18
nvm use 18
```

### Windows

#### Option A: Native (PowerShell)
1. Install **Node.js** (18+ LTS) from nodejs.org (Next → Next).  
2. Install **Git for Windows**.  
3. Global tools:
```powershell
npm i -g expo-cli hardhat
```
4. **MongoDB**: install MongoDB Community Server (optional local) from mongodb.com.

#### Option B: WSL (recommended)
1. Enable **Windows Subsystem for Linux** and install Ubuntu from the Store.
2. Open Ubuntu and follow the **Debian/Ubuntu** steps above.
3. Use Windows’ Android emulator/iOS simulators separately if needed.

---

## 3) Clone the Repository
```bash
git clone https://github.com/23abdul23/SE.git
cd SE
```

---

## 4) Install Project Dependencies
```bash
npm install --legacy-peer-deps
# If you hit peer conflicts:
# npm install --force
```

---

## 5) Configure Environment Variables

Create a **`.env`** file at the project root with the following **placeholders** (leave values blank until you generate them in Step 6):

```env
# Blockchain
AMOY_RPC_URL=""
PRIVATE_KEY=""

# Database
MONGODB_URI=""   # e.g., mongodb://localhost:27017/aegis-id OR your Atlas URI

# Auth
JWT_SECRET=""
JWT_EXPIRE="7d"

# Backend
API_HOST="localhost"
PORT="3000"

# Email (for notifications/password reset, etc.)
GMAIL_ID=""
GMAIL_PASSWORD=""
```

> **Never** commit `.env` to git. Add `.env` to `.gitignore`.

---

## 6) Generate Required Keys & Secrets (Step-by-Step)

### A) `AMOY_RPC_URL` (Polygon Amoy testnet)
You need an HTTPS RPC endpoint to read/write blockchain data.

**Choose one (examples):**
- Create a free project with a provider (e.g., Alchemy/Infura/QuickNode), select **Polygon Amoy**, and copy the **HTTPS RPC URL**.
- Or use an official/public Amoy RPC endpoint if your provider documents one.

**Paste the URL** into `AMOY_RPC_URL` in `.env`.

---

### B) `PRIVATE_KEY` (wallet for deployments)
**Warning:** This is sensitive. Use a **test wallet** only.

1. Create a new wallet (e.g., MetaMask).  
2. Add **Polygon Amoy** network in your wallet (or allow it to be added automatically by your provider).  
3. Create a **new account** dedicated to development.  
4. **Export the private key** for that test account (MetaMask → Account Details → Export Private Key).  
5. Fund it with **Amoy test MATIC** from a faucet provided by your RPC provider or Polygon docs.  
6. Put the exported private key string into `PRIVATE_KEY` in `.env`.

> Never use a **real mainnet** key here. Don’t share this key.

---

### C) `MONGODB_URI` (local or Atlas)

- **Local MongoDB**:
  - Start service (varies by OS):
    - macOS (brew): `brew services start mongodb-community`
    - Ubuntu (apt): `sudo systemctl start mongod`
  - Connection string:  
    `mongodb://localhost:27017/aegis-id`

- **MongoDB Atlas**:
  1. Create a free cluster.
  2. Add a database user.
  3. Allow your IP (or `0.0.0.0/0` for development only).
  4. Copy your connection string (SRV or standard) and paste into `MONGODB_URI`.

---

### D) `JWT_SECRET`
Generate a strong secret:

- **macOS/Linux**:
  ```bash
  openssl rand -hex 32
  ```
- **Windows PowerShell**:
  ```powershell
  $bytes = New-Object byte[] 32; (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [BitConverter]::ToString($bytes).Replace("-", "").ToLower()
  ```

Copy the output to `JWT_SECRET` in `.env`. Keep `JWT_EXPIRE="7d"` or adjust (e.g., `1d`, `12h`).

---

### E) `GMAIL_ID` & `GMAIL_PASSWORD` (App Password)
Used for transactional emails (dev only).

1. In your Google Account → **Security**:
   - Turn on **2-Step Verification**.
   - Open **App Passwords** → Create new (App: Mail, Device: Other).
2. Copy the 16-char **App Password** (spaces are fine to paste).
3. Set:
   - `GMAIL_ID` = your Gmail address.
   - `GMAIL_PASSWORD` = the **App Password**.

---

## 7) Start the Project

### Backend
```bash
npm run start
# or
node server.js
```
Your API should run at `http://localhost:3000` (or your `PORT`).

### Frontend (Expo)
```bash
npx expo start
```
- Scan the QR with **Expo Go** on your phone, or press `i` (iOS simulator) / `a` (Android emulator).

---

## 8) Smart Contracts (Optional)

```bash
# Compile
npx hardhat compile

# (Example) Deploy
node scripts/deploy.cjs
```

> Ensure your `.env` has valid `AMOY_RPC_URL` and `PRIVATE_KEY`.  
> If Hardhat config expects a named network, add it in `hardhat.config` (e.g., `amoy` with your RPC URL).

---

## 9) Troubleshooting

- **Dependency errors**  
  ```bash
  npm install --legacy-peer-deps
  # or
  npm install --force
  ```
- **Expo cache**  
  ```bash
  npx expo start -c
  ```
- **MongoDB connection**  
  - Verify `MONGODB_URI`, user/password, and IP whitelist (Atlas).
- **Ports in use**  
  - Change `PORT` in `.env`, or free the port.

---

## 10) Security Notes

- Use **test accounts** and **test RPCs** only.  
- Never share your `.env` or private keys.  
- Consider creating a separate `.env.example` (with blank values) for collaborators.

**`.env.example`**
```env
AMOY_RPC_URL=""
PRIVATE_KEY=""
MONGODB_URI=""
JWT_SECRET=""
JWT_EXPIRE="7d"
API_HOST="localhost"
PORT="3000"
GMAIL_ID=""
GMAIL_PASSWORD=""
```

---

## 11) Quick Commands by OS (recap)

**macOS**
```zsh
brew install node git
npm i -g expo-cli hardhat
brew install mongodb-community
```

**Ubuntu**
```bash
sudo apt update && sudo apt install -y curl git build-essential
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g expo-cli hardhat
```

**Windows (PowerShell)**
```powershell
npm i -g expo-cli hardhat
# JWT secret:
$bytes = New-Object byte[] 32; (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [BitConverter]::ToString($bytes).Replace("-", "").ToLower()
```
