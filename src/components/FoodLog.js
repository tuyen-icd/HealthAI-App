import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SectionList,
} from "react-native";
import { useFood } from "../store/FoodContext";
import { notifications, translations } from "../store/translateUI";

const FoodLog = () => {
  const { foodEntries, clearFoodEntries } = useFood();
  const [currentLang, setCurrentLang] = useState("vi");
  const [showModal, setShowModal] = useState(false);

  // Helper: lấy text đúng ngôn ngữ
  const getLocalizedText = (value) => {
    if (typeof value === "object" && value !== null) {
      return value[currentLang] || value["vi"] || JSON.stringify(value);
    }
    return value;
  };

  const groupedData = useMemo(() => {
    const groups = {};
    foodEntries.forEach((item) => {
      if (!groups[item.date]) groups[item.date] = [];
      groups[item.date].push(item);
    });

    return Object.keys(groups).map((date) => ({
      title: date,
      data: groups[date],
    }));
  }, [foodEntries]);

  const handleClear = () => {
    clearFoodEntries();
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.watermark}>© TUYENNNICD-VN</Text> */}
      <View style={styles.header}>
        <Text style={styles.title}>{translations[currentLang].foodLog}</Text>
        {/* <TouchableOpacity onPress={clearFoodEntries} style={styles.clearBtn}> */}
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.clearBtn}
        >
          <Text style={styles.clearText}>
            {translations[currentLang].clear}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 30,
          marginBottom: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.langSwitch}>
          {["vi", "en", "ja"].map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.langButton,
                currentLang === lang && styles.langActive,
              ]}
              onPress={() => setCurrentLang(lang)}
            >
              <Text
                style={[
                  styles.langBtn,
                  currentLang === lang && styles.langTextActive,
                ]}
              >
                {lang === "vi" ? "🇻🇳 VN" : lang === "en" ? "🇺🇸 EN" : "🇯🇵 JP"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {foodEntries.length === 0 ? (
        <Text style={styles.empty}>Chưa có dữ liệu</Text>
      ) : (
        // <FlatList
        //   data={foodEntries}
        //   keyExtractor={(_, i) => i.toString()}
        //   renderItem={({ item }) => (
        //     <View style={styles.entry}>
        //       <Text style={styles.text}>
        //         • {item.date} — {getLocalizedText(item.name)} (
        //         {getLocalizedText(item.calories)} kcal)
        //       </Text>
        //     </View>
        //   )}
        // />
        <SectionList
          sections={groupedData}
          keyExtractor={(_, i) => i.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.entry}>
              <Text style={styles.text}>
                • {getLocalizedText(item.name)} (
                {getLocalizedText(item.calories)} kcal)
              </Text>
            </View>
          )}
        />
      )}

      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {notifications[currentLang].warning}
            </Text>
            <Text style={styles.modalMessage}>
              {notifications[currentLang].title}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={{ color: "#000" }}>
                  {notifications[currentLang].cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "red" }]}
                onPress={handleClear}
              >
                <Text style={{ color: "#fff" }}>
                  {notifications[currentLang].confirm}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FoodLog;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 70 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  //   watermark: {
  //     position: "absolute",
  //     top: "40%",
  //     left: "10%",
  //     right: "10%",
  //     textAlign: "center",
  //     fontSize: 40,
  //     fontWeight: "bold",
  //     color: "rgba(0,0,0,0.05)", // chữ mờ
  //     transform: [{ rotate: "-20deg" }], // nghiêng cho giống watermark
  //     zIndex: -1, // nằm dưới nội dung
  //   },

  title: { fontSize: 20, fontWeight: "bold" },
  langSwitch: { flexDirection: "row", gap: 8 },
  langBtn: { paddingHorizontal: 8, paddingVertical: 4, color: "#555" },
  langActive: { color: "#ffffff", fontWeight: "bold" },
  clearBtn: {
    backgroundColor: "#f55",
    // borderRadius: 6,
    // padding: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    // borderWidth: 1,
    // borderColor: "#cbd5e0",
    // marginHorizontal: 5,
  },
  clearText: { color: "#fff" },
  entry: { paddingVertical: 6, borderBottomWidth: 0.5, borderColor: "#ccc" },
  text: { fontSize: 16 },
  empty: { marginTop: 20, textAlign: "center", color: "#999" },

  langButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#cbd5e0",
    marginHorizontal: 5,
  },
  langActive: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  langTextActive: { color: "#fff", fontWeight: "600" },

  //modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalMessage: { fontSize: 15, textAlign: "center", marginBottom: 20 },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
});
