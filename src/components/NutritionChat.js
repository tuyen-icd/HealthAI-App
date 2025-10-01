import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { callGemini } from "../services/gemini";
import Constants from "expo-constants";
import { KeyboardAvoidingView, Platform } from "react-native";

const API_KEY = Constants.expoConfig.extra.geminiApiKey;

export default function NutritionChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Keyboard.dismiss();

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const prompt = `
      Bạn là chatbot dinh dưỡng. Trả lời ngắn gọn, thân thiện.
      Hãy trả lời bằng chính ngôn ngữ mà người dùng đã hỏi.
      Câu hỏi: ${input}
    `;
    try {
      const reply = await callGemini(API_KEY, prompt);
      const botMsg = { role: "bot", text: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Xin lỗi, có lỗi xảy ra." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      //   keyboardVerticalOffset={80} //
    >
      <View style={styles.container}>
        <Text style={styles.title}>🤖 Nutrition Chatbot</Text>
        <FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Text style={item.role === "user" ? styles.user : styles.bot}>
              {item.role === "user" ? "🧑 " : "🤖 "}
              {item.text}
            </Text>
          )}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#4CAF50" />
            <Text style={{ marginLeft: 6, color: "#666" }}>Loading ...</Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Enter question..."
          />
          <TouchableOpacity style={styles.button} onPress={sendMessage}>
            <Text style={{ color: "#fff" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    flex: 1,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    padding: 8,
    borderRadius: 8,
    marginVertical: 2,
  },
  bot: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 8,
    marginVertical: 2,
  },
  inputRow: { flexDirection: "row", marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    marginLeft: 5,
    justifyContent: "center",
  },
});
