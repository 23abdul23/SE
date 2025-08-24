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
API_HOST=localhost
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

## Need Help?

If you encounter any problems or installation difficulties, contact -O- Abdul ASAP.

---
