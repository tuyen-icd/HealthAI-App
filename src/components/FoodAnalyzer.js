// FoodAnalyzer.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { translations } from "../store/translateUI";
import { useFood } from "../store/FoodContext";

const API_KEY = Constants.expoConfig.extra.geminiApiKey;

export default function FoodAnalyzer() {
  const [image, setImage] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lang, setLang] = useState("vi");
  const insets = useSafeAreaInsets();

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectModalVisible, setSelectModalVisible] = useState(false);

  const [age, setAge] = useState("25");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const { addFoodEntry } = useFood();

  const pickImageFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      analyzeFood(result.assets[0].base64);
    }
    setSelectModalVisible(false);
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Cần cấp quyền camera để sử dụng tính năng này!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      analyzeFood(result.assets[0].base64);
    }
    setSelectModalVisible(false);
  };

  const analyzeFood = async (base64) => {
    setLoading(true);
    setErrorMsg("");
    setFoodData(null);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
                  You are a nutrition assistant.
                  Analyze this food picture and return JSON with fields {name, ingredients, calories, protein, carbs, fat, benefits}.
                  Each field must have translations in 3 languages: Vietnamese (vi), English (en), Japanese (ja).
                  Return ONLY JSON, no explanation.
                `,
                  },
                  { inline_data: { mime_type: "image/jpeg", data: base64 } },
                ],
              },
            ],
          }),
        }
      );

      //   console.log("response", response);
      const data = await response.json();
      //   console.log("data", data);
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      text = text.replace(/```json|```/g, "").trim();

      try {
        const parsed = JSON.parse(text);
        setFoodData(parsed);
        addFoodEntry(parsed);
      } catch (e) {
        console.error("JSON parse error:", e);
        setErrorMsg("⚠️ Không đọc được JSON từ Gemini.");
      }
    } catch (err) {
      setErrorMsg("❌ Lỗi khi gọi Gemini API.");
    }

    setLoading(false);
  };

  // tính calo cần đốt
  const getCalorieBurnInfo = () => {
    if (!foodData || !weight || !height || !age) return null;

    const calStr = foodData.calories?.[lang]?.match(/\d+/);
    const caloriesFood = calStr ? parseFloat(calStr[0]) : 0;
    if (caloriesFood <= 0) return null;

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    const bmrMale = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
    const bmrFemale = 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;

    const activities = [
      { name: { vi: "🏃‍♂️ Chạy bộ", en: "Running", ja: "ランニング" }, cal: 300 },
      {
        name: { vi: "🚶‍♀️ Đi bộ nhanh", en: "Fast Walking", ja: "早歩き" },
        cal: 150,
      },
      {
        name: { vi: "🚴‍♂️ Đạp xe", en: "Cycling", ja: "サイクリング" },
        cal: 250,
      },
      { name: { vi: "🏊‍♀️ Bơi lội", en: "Swimming", ja: "水泳" }, cal: 350 },
    ];

    return { caloriesFood, bmrMale, bmrFemale, activities };
  };

  const burnInfo = getCalorieBurnInfo();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{translations[lang].title}</Text>
          <Text style={styles.subtitle}>{translations[lang].subtitle}</Text>

          {/* Input user */}
          {/* Tuổi */}
          <View style={styles.inputRow}>
            <Text style={styles.sectionTitle}>{translations[lang].age}:</Text>
            <TextInput
              style={[styles.input, { textAlign: "center" }]}
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </View>
          {/* Cân nặng */}
          <View style={styles.inputRow}>
            <Text style={styles.sectionTitle}>
              {translations[lang].weight}:
            </Text>
            <TextInput
              style={[styles.input, { textAlign: "center" }]}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
          {/* Chiều cao */}
          <View style={styles.inputRow}>
            <Text style={styles.sectionTitle}>
              {translations[lang].height}:
            </Text>
            <TextInput
              style={[styles.input, { textAlign: "center" }]}
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>

          {/* Button chọn ảnh */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSelectModalVisible(true)}
          >
            <Text style={styles.buttonText}>
              {translations[lang].pickImage}
            </Text>
          </TouchableOpacity>

          {image && <Image source={{ uri: image.uri }} style={styles.image} />}

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={{ color: "#fff", marginTop: 10 }}>
                {translations[lang].analyzing}
              </Text>
            </View>
          )}

          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

          {/* Language Switch */}
          <View style={styles.langContainer}>
            {["vi", "en", "ja"].map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.langButton, lang === l && styles.langActive]}
                onPress={() => setLang(l)}
              >
                <Text
                  style={[styles.langText, lang === l && styles.langTextActive]}
                >
                  {l === "vi" ? "🇻🇳 VN" : l === "en" ? "🇺🇸 EN" : "🇯🇵 JP"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {!foodData && (
            <Text style={styles.guideText}>{translations[lang].guide}</Text>
          )}

          {/* Kết quả */}
          {foodData && (
            <View style={styles.card}>
              <Text style={styles.foodName}>🍽 {foodData.name?.[lang]}</Text>
              {/* Thông tin dinh dưỡng */}
              <Text style={styles.sectionTitle}>
                {translations[lang].calories}:
              </Text>
              <Text style={styles.textItem}>{foodData.calories?.[lang]}</Text>
              {/* Protein */}
              <Text style={styles.sectionTitle}>
                {translations[lang].protein}:
              </Text>
              <Text style={styles.textItem}>{foodData.protein?.[lang]}</Text>
              {/* Carbs */}
              <Text style={styles.sectionTitle}>
                {translations[lang].carbs}:
              </Text>
              <Text style={styles.textItem}>{foodData.carbs?.[lang]}</Text>
              {/* Fat */}
              <Text style={styles.sectionTitle}>{translations[lang].fat}:</Text>
              <Text style={styles.textItem}>{foodData.fat?.[lang]}</Text>
              {/* Lợi ích */}
              <Text style={styles.sectionTitle}>
                {translations[lang].benefits}:
              </Text>
              {Array.isArray(foodData.benefits?.[lang]) ? (
                foodData.benefits[lang].map((b, i) => (
                  <Text key={i} style={styles.textItem}>
                    • {b}
                  </Text>
                ))
              ) : (
                <Text style={styles.textItem}>
                  {foodData.benefits?.[lang] || "❌ Không có dữ liệu"}
                </Text>
              )}

              {/* Thông tin đốt calo */}
              {burnInfo && (
                <View>
                  <Text style={styles.sectionTitle}>
                    {translations[lang].energyFromFood}: {burnInfo.caloriesFood}{" "}
                    kcal
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.sectionTitle}>
                      {translations[lang].bmrMale} {burnInfo.bmrMale.toFixed(0)}{" "}
                      kcal/day
                    </Text>
                    <TouchableOpacity onPress={() => setTooltipVisible(true)}>
                      <Text style={{ marginLeft: 5, fontSize: 20 }}>ℹ️</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.sectionTitle}>
                      {translations[lang].bmrFemale}{" "}
                      {burnInfo.bmrFemale.toFixed(0)} kcal/day
                    </Text>
                    <TouchableOpacity onPress={() => setTooltipVisible(true)}>
                      <Text style={{ marginLeft: 5, fontSize: 20 }}>ℹ️</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
                    {translations[lang].exerciseSuggest} {burnInfo.caloriesFood}{" "}
                    kcal:
                  </Text>
                  {burnInfo.activities.map((act, i) => (
                    <Text key={i} style={styles.textItem}>
                      • {act.name[lang]} ~{" "}
                      {Math.ceil((burnInfo.caloriesFood / act.cal) * 30)}{" "}
                      {translations[lang].minutes}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
          <Modal transparent visible={selectModalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.tooltipBox}>
                <Text style={styles.tooltipTitle}>
                  {translations[lang].titleModal}
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={pickImageFromLibrary}
                >
                  <Text style={styles.buttonText}>
                    {translations[lang].gallery}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={takePhotoWithCamera}
                >
                  <Text style={styles.buttonText}>
                    {translations[lang].camera}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.closeButton, { marginTop: 10 }]}
                  onPress={() => setSelectModalVisible(false)}
                >
                  <Text style={{ color: "#fff" }}>
                    {translations[lang].cancel}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            transparent
            animationType="fade"
            visible={tooltipVisible}
            onRequestClose={() => setTooltipVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.tooltipBox}>
                <Text style={styles.tooltipTitle}>
                  ℹ️ {translations[lang].bmrTooltipTitle}
                </Text>
                <Text style={styles.tooltipText}>
                  {translations[lang].bmrTooltipContent}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setTooltipVisible(false)}
                >
                  <Text style={{ color: "#fff" }}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
  },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "40%",
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  image: { width: "100%", height: 220, borderRadius: 16, marginBottom: 20 },
  loadingOverlay: {
    position: "absolute",
    width: "50%",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  error: { color: "red", marginTop: 20, textAlign: "center" },
  langContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  langButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#cbd5e0",
    marginHorizontal: 5,
  },
  langActive: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  langText: { fontSize: 14, color: "#4a5568" },
  langTextActive: { color: "#fff", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 30,
  },
  foodName: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  textItem: { fontSize: 15, marginLeft: 10, marginTop: 2 },
  guideText: { fontSize: 12, textAlign: "left", marginVertical: 20 },

  //    Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tooltipText: {
    fontSize: 14,
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  guideText: {
    fontSize: 14,
    color: "#9c9c9c",
    textAlign: "left",
    marginVertical: 20,
    paddingHorizontal: 15,
    lineHeight: 24,
  },

  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  refreshButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
