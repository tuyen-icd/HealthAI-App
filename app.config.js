import "dotenv/config";

export default {
  expo: {
    name: "HealthAI-App",
    slug: "healthai-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/Gemini_Generated.jpeg",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/Gemini_Generated.jpeg",
      resizeMode: "cover",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.ngoctuyen.healthaiapp",
      adaptiveIcon: {
        foregroundImage: "./assets/Gemini_Generated.jpeg",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/Gemini_Generated.jpeg",
    },
    extra: {
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      eas: {
        projectId: "fcdf7c3a-daa3-40ee-af72-ae19bfbc66c7",
      },
    },
  },
};
