# 📱 Mobile App Setup Guide

This document provides setup instructions for the React Native + Expo mobile app project. Follow these steps to fork the repository, install dependencies, configure Android Studio, set up the backend server, and run the app on a real device or emulator.

---

## 1️⃣ Fork & Clone the Repository

- Fork the repository to your GitHub account.
- Clone your forked repository:


_Example:_  
`git clone https://github.com/23abdul23/SE.git`  
`cd SE`

_Do not run the above example as-is—replace with your details._

---

## 2️⃣ Set Up Environment Variables

- Create a `.env` file in the project root with the following content:


MONGODB_URI=mongodb://localhost:27017/aegis-id

JWT_SECRET=secret

JWT_EXPIRE=7d

API_HOST=YOUR_LAPTOP_IP

PORT=3000


- **Tip:** Install MongoDB and MongoDB Compass for database management.

---

## 3️⃣ Install Dependencies

In the `SE` folder, run:

`npm install`

`npm install --legacy-peer-deps` If some error arises

`npm install -g expo-cli`



---

## 4️⃣ Install Android Studio & SDK

1. [Download Android Studio](https://developer.android.com/studio)
2. During setup, install:
 - Android SDK
 - Android SDK Platform Tools
 - Android Emulator
3. Add Android SDK to your system `PATH`:
 - **Linux/macOS:**
   ```
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH
   ```
   - Add to your `~/.bashrc` or `~/.zshrc`
   - Reload your shell:
     ```
     source ~/.bashrc
     ```
 - **Windows:**  
   Edit Environment Variables in System Properties.

---

## 5️⃣ Run on Android Device or Emulator

### Option A: Real Device (Recommended)

1. Enable Developer Options & USB Debugging on your phone.
2. Connect the device via USB.
3. Verify connection:
`adb devices`


### Option B: Emulator

1. Open Android Studio → Device Manager
2. Create a new Virtual Device (Pixel, API 34 recommended)
3. Start the emulator

---

## 6️⃣ Start the App

In the `SE` folder, run:

`npx expo start --tunnel`


Metro Bundler will start, and the app will launch on your device or emulator.

---

## 7️⃣ Start the Backend Server

- To start the backend server, run the following command in your `SE` folder:

`nodemon server.js`


- Ensure nodemon is installed (`npm install -g nodemon` if needed).

---

## 8️⃣ Troubleshooting

- **Error: `spawn adb ENOENT`**  
Ensure `adb` is in your system `PATH`.
- **Device not detected**  
Try:

`adb kill-server`
`adb start-server`
`adb devices`

- **Further issues?** Contact Abdul for assistance.

---

## 9️⃣ Connect Phone to Server (Complete Setup)

Follow these steps to connect your phone app to the backend server running on your laptop:

### Step 1: Find Your Laptop's IP Address
```bash
# Windows Command Prompt
ipconfig

# Look for "IPv4 Address" under your active network adapter
# Example: 192.168.1.100 or 172.19.x.x
```

### Step 2: Update API Configuration
1. Open `.env` file
2. Replace the IP address in `YOUR_LAPTOP_IP` with your laptop's IP OR Edit in the `./ server/api.js`
```javascript
const API_BASE_URL = `http://YOUR_LAPTOP_IP:3000/api`;
// Example: const API_BASE_URL = `http://192.168.1.100:3000/api`;
```

### Step 3: Configure Windows Firewall (Windows Users)
1. **Windows Security** → **Firewall & network protection**
2. **Allow an app through firewall** → **Change Settings**
3. **Allow another app** → Browse and select **Node.js** 
   - Usually located at: `C:\Program Files\nodejs\node.exe`
4. Check both **Private** and **Public** network boxes
5. Click **OK**

### Step 4: Start Backend Server
```bash
# In your SE folder
nodemon server.js

# You should see:
# 🚀 Aegis ID Backend running on port 3000
# 📦 MongoDB Connected: localhost
```

### Step 5: Start Expo Development Server
```bash
# In your SE folder
npx expo start --tunnel

# This will show a QR code in your terminal
```

### Step 6: Connect Your Phone
1. **Ensure both devices are on the same WiFi network**
2. **Download Expo Go app** from:
   - [Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
3. **Scan QR Code**:
   - Android: Open Expo Go → Scan QR code from terminal
   - iOS: Use Camera app → Scan QR code → Tap notification

### Step 7: Test Connection
1. **Test API from phone browser**:
   - Open browser on phone
   - Navigate to: `http://YOUR_LAPTOP_IP:3000/api/health`
   - Should show: `{"status":"OK","message":"Aegis ID Backend is running"}`

2. **Test App Registration**:
   - Open the app on your phone
   - Try registering a new user
   - Check your laptop terminal for incoming requests

### Troubleshooting Connection Issues

**Problem: "Network Error" when registering**
```bash
# 1. Verify server is running
curl http://localhost:3000/api/health

# 2. Check if port 3000 is accessible
netstat -an | findstr :3000

# 3. Test from phone browser
# Go to: http://YOUR_LAPTOP_IP:3000/api/health
```

**Problem: Can't connect to laptop**
- ✅ Both devices on same WiFi network
- ✅ Windows Firewall allows Node.js
- ✅ Correct IP address in `services/api.js`
- ✅ Backend server is running on port 3000

**Problem: QR Code doesn't work**
```bash
# Try tunnel mode for better connectivity
npx expo start --tunnel

# Or use direct connection
npx expo start --lan
```

### Expected Flow
1. **Phone** → Sends registration data → **Laptop API**
2. **Laptop** → Processes request → **MongoDB Database**  
3. **Laptop** → Returns response → **Phone App**
4. **Registration success/failure** shown on phone

---

## Need Help?

If you encounter any problems or installation difficulties, contact -O- Abdul ASAP.

---
