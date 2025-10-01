import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import { stepsOnboarding } from "./src/store/translateUI";
import FoodAnalyzer from "./src/components/FoodAnalyzer";
import FoodLog from "./src/components/FoodLog";
import NutritionChat from "./src/components/NutritionChat";
import Ionicons from "@react-native-vector-icons/ionicons";
import { FoodProvider } from "./src/store/FoodContext";

// ===== Bottom Tabs =====
const Tab = createBottomTabNavigator();

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem("hasLaunched").then((value) => {
      if (value === "true") {
        setShowOnboarding(false);
      }
    });
  }, []);

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("hasLaunched", "true");
    setShowOnboarding(false);
  };

  const handleNext = () => {
    if (step < stepsOnboarding.length - 1) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  return (
    <SafeAreaProvider>
      {showOnboarding ? (
        <OnboardingScreen step={step} onNext={handleNext} />
      ) : (
        <NavigationContainer>
          <FoodProvider>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#4CAF50",
                tabBarInactiveTintColor: "#777",
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === "Analyze") {
                    iconName = focused ? "restaurant" : "restaurant-outline";
                  } else if (route.name === "Log") {
                    iconName = focused ? "book" : "book-outline";
                  } else if (route.name === "Chat") {
                    iconName = focused ? "chatbubble" : "chatbubble-outline";
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
            >
              <Tab.Screen
                name="Analyze"
                component={FoodAnalyzer}
                options={{ title: "Analysis" }}
              />
              <Tab.Screen
                name="Log"
                component={FoodLog}
                options={{ title: "Food Log" }}
              />
              <Tab.Screen
                name="Chat"
                component={NutritionChat}
                options={{ title: "Chatbot" }}
              />
            </Tab.Navigator>
          </FoodProvider>
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}

// ===== Onboarding =====
function OnboardingScreen({ step, onNext }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.onboardContainer}>
        <Image
          source={require("./assets/Gemini_Generated.jpeg")}
          style={styles.onboardImage}
        />
        <Text style={styles.onboardTitle}>{stepsOnboarding[step].title}</Text>
        <Text style={styles.onboardText}>{stepsOnboarding[step].text}</Text>

        <TouchableOpacity style={styles.onboardButton} onPress={onNext}>
          <Text style={styles.onboardButtonText}>
            {stepsOnboarding[step].nextBtnText}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ===== Styles =====
const styles = StyleSheet.create({
  onboardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  onboardImage: {
    width: 220,
    height: 220,
    marginBottom: 20,
    resizeMode: "contain",
  },
  onboardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  onboardText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  onboardButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
  },
  onboardButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
