import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FoodContext = createContext();

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error("useFood must be used within a FoodProvider");
  }
  return context;
};

export const FoodProvider = ({ children }) => {
  const [foodEntries, setFoodEntries] = useState([]);

  // Load food entries from AsyncStorage on app start
  useEffect(() => {
    const loadFoodEntries = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem("foodEntries");
        if (storedEntries) {
          setFoodEntries(JSON.parse(storedEntries));
        }
      } catch (error) {
        console.error("❌ Failed to load food entries:", error);
      }
    };
    loadFoodEntries();
  }, []);

  // Save to AsyncStorage whenever foodEntries changes
  useEffect(() => {
    const saveFoodEntries = async () => {
      try {
        await AsyncStorage.setItem("foodEntries", JSON.stringify(foodEntries));
      } catch (error) {
        console.error("❌ Failed to save food entries:", error);
      }
    };
    if (foodEntries.length > 0) {
      saveFoodEntries();
    }
  }, [foodEntries]);

  const addFoodEntry = (entry) => {
    const newEntry = {
      ...entry,
      date: new Date().toLocaleDateString("vi-VN"), // "30/09/2025"
      calories: {
        en: entry.calories?.en || 0,
        ja: entry.calories?.ja || 0,
        vi: entry.calories?.vi || 0,
      },
    };
    setFoodEntries((prev) => [newEntry, ...prev]); // Add new entry to beginning
  };

  const clearFoodEntries = async () => {
    try {
      await AsyncStorage.removeItem("foodEntries");
    } catch (error) {
      console.error("❌ Failed to clear food entries:", error);
    }
    setFoodEntries([]);
  };

  const value = useMemo(
    () => ({ foodEntries, addFoodEntry, clearFoodEntries }),
    [foodEntries]
  );

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
};
