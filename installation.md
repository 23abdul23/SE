# Installation Guide for Aegis ID Project

This guide will help you set up and run the Aegis ID project on macOS using zsh. It covers all required software, package installations, and environment variable setup.

---

## 1. Prerequisites

### Required Software
- **Node.js (v18 or above recommended)**
- **npm (comes with Node.js)**
- **Expo CLI** (for React Native frontend)
- **MongoDB** (local or Atlas for backend)
- **Git**
- **Hardhat** (for smart contract development)

### Install Prerequisites
```zsh
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and npm
brew install node

# Install Git
brew install git

# Install Expo CLI globally
npm install -g expo-cli

# Install Hardhat globally
npm install -g hardhat

# (Optional) Install MongoDB locally
brew tap mongodb/brew
brew install mongodb-community
```

---

## 2. Clone the Repository
```zsh
git clone https://github.com/23abdul23/SE.git
cd SE
```

---

## 3. Install Project Dependencies
```zsh
# In the project root
npm install --legacy-peer-deps
```

---

## 4. Set Up Environment Variables

Create a `.env` file in the project root. Example:
```env
AMOY_RPC_URL="https://rpc-amoy.polygon.technology/"
PRIVATE_KEY="fbc3bdb9b414628dc0645b2eccdbbf308c18269ac29c9775601cdd057912ba47"
#MONGODB_URI=mongodb://localhost:27017/aegis-id
MONGODB_URI_C=mongodb+srv://odooAdmin:aegisid1234@cluster0.mfv2pgl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=secret
JWT_EXPIRE=7d
API_HOST=localhost
GMAIL_ID=aegisid777@gmail.com
GMAIL_PASSWORD="njhg lezb kvys lihc"
PORT=3000
```

### Explanation of Variables
- **AMOY_RPC_URL**: Polygon Amoy testnet RPC endpoint for blockchain interactions.
- **PRIVATE_KEY**: Your wallet's private key for contract deployment/interactions.
- **MONGODB_URI_C**: MongoDB connection string (local or Atlas).
- **JWT_SECRET**: Secret for JWT authentication.
- **JWT_EXPIRE**: JWT token expiry duration.
- **API_HOST**: Host for backend API (usually localhost).
- **GMAIL_ID**: Gmail address for sending emails.
- **GMAIL_PASSWORD**: Gmail app password (not your regular password).
- **PORT**: Port for backend server.

---

## 5. Running the Project

### Start Backend Server
```zsh
npm run start # or node server.js
```

### Start Expo Frontend
```zsh
npx expo start
```

Scan the QR code with Expo Go app on your mobile device to run the frontend.

---

## 6. Smart Contract Development (Optional)

If you want to deploy/interact with smart contracts:
```zsh
# Compile contracts
npx hardhat compile

# Deploy contracts
node scripts/deploy.cjs
```

---

## 7. Troubleshooting
- If you see dependency errors, use `npm install --force`.
- Ensure your `.env` file is correctly filled and present in the root directory.
- For Expo issues, try clearing cache: `npx expo start -c`.

---

## 8. Additional Notes
- For MongoDB Atlas, create a free cluster and get your connection string.
- For Gmail, set up an App Password (Google Account > Security > App Passwords).
- Never commit your `.env` file to public repositories.

---

For further help, see the README.md or contact the project maintainer.
