import React, { useState, useEffect } from "react";
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
import { stepsOnboarding, translations } from "./src/store/translateUI";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = Constants.expoConfig.extra.geminiApiKey;

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Kiểm tra nếu đã từng mở app thì bỏ qua onboarding
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
    if (step < 2) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  if (showOnboarding) {
    return <OnboardingScreen step={step} onNext={handleNext} />;
  }

  return <MainApp />;
}
function OnboardingScreen({ step, onNext }) {
  // const steps = [
  //   {
  //     title: "👋 Chào mừng bạn đến với HealthAI!",
  //     text:
  //       "Ứng dụng giúp bạn phân tích dinh dưỡng từ món ăn 🍜\n\n" +
  //       "👉 Nhập tuổi, cân nặng, chiều cao và chọn ảnh món ăn.\n\n" +
  //       "🧠 AI sẽ phân tích và gợi ý chế độ ăn phù hợp.",
  //   },
  //   {
  //     title: "👋 Welcome to HealthAI!",
  //     text:
  //       "This app helps you analyze nutrition from your food 🍔\n\n" +
  //       "👉 Enter your age, weight, height, and choose a food photo.\n\n" +
  //       "🧠 AI will analyze and suggest a suitable diet.",
  //   },
  //   {
  //     title: "👋 ヘルスAIへようこそ!",
  //     text:
  //       "このアプリは料理の栄養を分析します 🍣\n\n" +
  //       "👉 年齢、体重、身長を入力し、食べ物の写真を選んでください。\n\n" +
  //       "🧠 AIが分析して適切な食事を提案します。",
  //   },
  // ];
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
function MainApp() {
  const [image, setImage] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lang, setLang] = useState("vi");

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectModalVisible, setSelectModalVisible] = useState(false);

  // input người dùng
  const [age, setAge] = useState("25"); // cm
  const [weight, setWeight] = useState(""); // kg
  const [height, setHeight] = useState(""); // cm

  // chọn ảnh từ thư viện
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

  // gọi Gemini để phân tích ảnh món ăn
  const analyzeFood = async (base64) => {
    setLoading(true);
    setErrorMsg("");
    setFoodData(null);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
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

      const data = await response.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      text = text.replace(/```json|```/g, "").trim();

      try {
        const parsed = JSON.parse(text);
        setFoodData(parsed);
      } catch (e) {
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

    // lấy số từ chuỗi calories
    const calStr = foodData.calories?.[lang]?.match(/\d+/);
    const caloriesFood = calStr ? parseFloat(calStr[0]) : 0;
    if (caloriesFood <= 0) return null;

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    // Công thức BMR (nam & nữ)
    const bmrMale = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
    const bmrFemale = 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;

    // gợi ý vận động (30 phút trung bình)
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
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Header */}
          <Text style={styles.title}> {translations[lang].title}</Text>
          <Text style={styles.subtitle}>{translations[lang].subtitle}</Text>

          {/* Input user */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: "50%",
              }}
            >
              <Text style={styles.sectionTitle}>{translations[lang].age}:</Text>
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                marginLeft: 10,
                width: "30%",
                paddingVertical: 10,
              }}
            >
              <TextInput
                style={[styles.input, { textAlign: "center" }]}
                placeholder="Nhập tuổi"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: "50%",
              }}
            >
              <Text style={styles.sectionTitle}>
                {translations[lang].weight}:
              </Text>
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                marginLeft: 10,
                width: "30%",
                paddingVertical: 10,
              }}
            >
              <TextInput
                style={[styles.input, { textAlign: "center" }]}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: "50%",
              }}
            >
              <Text style={styles.sectionTitle}>
                {translations[lang].height}:
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                marginLeft: 10,
                width: "30%",
                paddingVertical: 10,
              }}
            >
              <TextInput
                style={[styles.input, { textAlign: "center" }]}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
            </View>
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
                Đang phân tích...
              </Text>
            </View>
          )}

          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

          {/* Language Switch luôn hiển thị */}
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

          {/* Card hiển thị thông tin */}
          {foodData && (
            <View style={styles.card}>
              <Text style={styles.foodName}>🍽 {foodData.name?.[lang]}</Text>

              <Text style={styles.sectionTitle}>
                {translations[lang].ingredients}:
              </Text>
              {Array.isArray(foodData.ingredients?.[lang]) ? (
                foodData.ingredients[lang].map((item, i) => (
                  <Text key={i} style={styles.textItem}>
                    • {item}
                  </Text>
                ))
              ) : (
                <Text style={styles.textItem}>
                  {foodData.ingredients?.[lang] || "❌ Không có dữ liệu"}
                </Text>
              )}
              <Text style={styles.sectionTitle}>
                {translations[lang].calories}:
              </Text>
              <Text style={styles.textItem}>{foodData.calories?.[lang]}</Text>

              <Text style={styles.sectionTitle}>
                {translations[lang].protein}:
              </Text>
              <Text style={styles.textItem}>{foodData.protein?.[lang]}</Text>

              <Text style={styles.sectionTitle}>
                {translations[lang].carbs}:
              </Text>
              <Text style={styles.textItem}>{foodData.carbs?.[lang]}</Text>

              <Text style={styles.sectionTitle}>{translations[lang].fat}:</Text>
              <Text style={styles.textItem}>{foodData.fat?.[lang]}</Text>

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

              {/* 🚀 Phần vận động */}
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
                      <Text style={{ marginLeft: 5 }}>ℹ️</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.sectionTitle}>
                      {translations[lang].bmrFemale}{" "}
                      {burnInfo.bmrFemale.toFixed(0)} kcal/day
                    </Text>
                    <TouchableOpacity onPress={() => setTooltipVisible(true)}>
                      <Text style={{ marginLeft: 5 }}>ℹ️</Text>
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
          {foodData && (
            <View style={styles.resultContainer}>
              {/* Nút Refresh */}
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => {
                  setFoodData(null); // xoá kết quả cũ
                  setImage(null); // reset lại ảnh (nếu muốn giữ ảnh thì bỏ dòng này)
                }}
              >
                <Text style={styles.refreshButtonText}>
                  {translations[lang].analysis}
                </Text>
              </TouchableOpacity>
            </View>
          )}

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

          <Modal transparent visible={selectModalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.tooltipBox}>
                <Text style={styles.tooltipTitle}>📸 Select image source</Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={pickImageFromLibrary}
                >
                  <Text style={styles.buttonText}>🖼️ From the library</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={takePhotoWithCamera}
                >
                  <Text style={styles.buttonText}>📷 Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.closeButton, { marginTop: 10 }]}
                  onPress={() => setSelectModalVisible(false)}
                >
                  <Text style={{ color: "#fff" }}>❌ Close</Text>
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
    color: "#2d3748",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#718096",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  image: { width: "100%", height: 220, borderRadius: 16, marginBottom: 20 },
  loadingOverlay: {
    position: "absolute",
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
  foodName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2d3748",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#2d3748",
  },
  textItem: { fontSize: 15, marginLeft: 10, color: "#4a5568", marginTop: 2 },

  //Modal
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
    fontSize: 12,
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
  // Onboarding styles
  onboardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFFFFFFF",
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
  onboardButton: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 10 },
  onboardButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
