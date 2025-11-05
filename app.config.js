import os from "os";

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "10.95.124.171"; // here enter your IP 
}

console.log("Local IP Address:", getLocalIPAddress());

module.exports = {
  expo: {
    name: "Aegis ID",
    slug: "Aegis ID",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      PORT : 3000,
      API_HOST: getLocalIPAddress()
    },
    plugins: [
      "expo-barcode-scanner",
      "expo-font"
    ]
  }
};
