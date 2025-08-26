# HealthAI-App: An Overview

HealthAI-App is a mobile application that uses AI to analyze nutritional information from food images. 
The app supports multiple languages: Vietnamese, English, and Japanese.

---

## Features

- User Information Input: Enter your age, weight, and height.
- Image Selection: Capture or select food photos from your device's library.
- AI-Powered Analysis: The AI analyzes the food and displays detailed nutritional information, including:
  - Calo
  - Protein
  - Carbs
  - Fat
  - Ingredients
  - Nutritional benefits
- Exercise Suggestions: Provides recommended exercise levels to balance energy intake.
- Onboarding: A guided onboarding process for first-time users.
- Language Switch: Supports quick language switching between VN / EN / JP.

---

## Technologies Used

- **React Native** with **Expo**
- **Google Gemini API** for food image analysis
- **AsyncStorage** for local onboarding status storage
- **expo-image-picker** for selecting or capturing food images

---

## Installation & Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/tuyen-icd/HealthAI-App.git
cd HealthAI-App
````

### 2. Install Dependencies
```
npm install
# or
yarn install
```

### 3. Set up Environment Variables (Skip if you already have a .env file)
```
Create a .env file in the root directory with the following content:
EXPO_PUBLIC_GEMINI_API_KEY=<your_gemini_api_key>
```

### 4. Run the App in a Development Environment
```
npx expo start

Scan the QR code with Expo Go on your phone, or run it on an Android/iOS simulator.
```
