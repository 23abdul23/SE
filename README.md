# 📱 Mobile App Setup Guide

This document provides setup instructions for the React Native + Expo mobile app project. Follow these steps to fork the repository, install dependencies, configure Android Studio, set up the backend server, and run the app on a real device or emulator.

Follow installation.md to install all dependecies required for the project.

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

```
MONGODB_URI= mongodb://localhost:27017/aegis-id
MONGODB_URI_C = <mongo db atlas cluster uri>
JWT_SECRET=secret
JWT_EXPIRE=7d
API_HOST=YOUR_LAPTOP_IP
PORT=3000
DATABASE=CLOUD  <For local development set this to LOCAL>
GMAIL_ID=aegisid777@gmail.com
GMAIL_PASSWORD= <your google oauth app password>
```

- **Tip:** Install MongoDB and MongoDB Compass for database management.

---

## 3️⃣ Install Dependencies

In the `SE` folder, run:

`npm install`

`npm install --legacy-peer-deps` If some error arises

`npm install -g expo-cli`



---

## 4️⃣ Start the App

In the `SE` folder, run:

`npx expo start`


Metro Bundler will start, and the app will launch on your device or emulator.

---

## 7️⃣ Start the Backend Server

- To start the backend server, run the following command in your `SE` folder:

`nodemon server.js`


- Ensure nodemon is installed (`npm install -g nodemon` if needed).

---

## 8️⃣ Troubleshooting
Contact Abdul for assistance.

---

## 9️⃣ Connect Phone to Server (Complete Setup)

Follow these steps to connect your phone app to the backend server running on your laptop:

### Step 1: Connect your Mobile devices and Laptops to a common WIFI Network

### Step 2: Configure Windows Firewall (Windows Users) (OPTIONAL)
1. **Windows Security** → **Firewall & network protection**
2. **Allow an app through firewall** → **Change Settings**
3. **Allow another app** → Browse and select **Node.js** 
   - Usually located at: `C:\Program Files\nodejs\node.exe`
4. Check both **Private** and **Public** network boxes
5. Click **OK**

### Step 3: Start Backend Server
```bash
# In your SE folder
nodemon server.js

# You should see:
# 🚀 Aegis ID Backend running on port 3000
# 📦 MongoDB Connected: localhost
```

### Step 4: Start Expo Development Server
```bash
# In your SE folder
npx expo start 

# This will show a QR code in your terminal
```

### Step 5: Connect Your Phone
1. **Ensure both devices are on the same WiFi network**
2. **Download Expo Go app** from:
   - [Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
3. **Scan QR Code**:
   - Android: Open Expo Go → Scan QR code from terminal
   - iOS: Use Camera app → Scan QR code → Tap notification

### Step 6: Test Connection
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
**Some npm related Issues:**
- run `npm install -g expo-cli`
- run `npm install`
- run `npx expo install expo-camera`


### Expected Flow
1. **Phone** → Sends registration data → **Laptop API**
2. **Laptop** → Processes request → **MongoDB Database**  
3. **Laptop** → Returns response → **Phone App**
4. **Registration success/failure** shown on phone
   
---

## Need Help?

If you encounter any problems or installation difficulties, contact -O- Abdul ASAP (Raat me mat pareshan Karna).
---
