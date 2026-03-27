import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  Linking,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import { scale } from "react-native-size-matters";
import axios from "axios";
import * as SQLite from "expo-sqlite";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { conversationAPI } from "@/utils/api_rag";
import { useTheme } from "@/context/ThemeContext";
import Sidebar from "@/components/Sidebar";
import * as Speech from "expo-speech";
import * as Clipboard from "expo-clipboard";
import ProfileModal from "@/components/ProfileModal";
import { Keyboard } from "react-native";

const db = SQLite.openDatabaseSync("chat.db");

const ChatScreen = () => {
  const router = useRouter();
  const flatListRef = useRef(null);
  const { theme } = useTheme();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  //for history list in sidebar
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const [userMessage, setUserMessage] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedFromHistory, setLoadedFromHistory] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const { currentUser } = useCurrentUser();
  const tableName = `messages_${currentUser?._id}`;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  // save chat messages to asyncStorage for offline use
  useEffect(() => {
    if (!messages.length) return;
    if (loadedFromHistory) {
      setLoadedFromHistory(false); // 👈 skip saving first load only
      return;
    }

    const latestMessage = messages[messages.length - 1];

    const timeout = setTimeout(() => {
      const timestamp = new Date().toISOString();

      db.runSync(
        `INSERT INTO ${tableName} (sender, content, timestamp,session_id) VALUES (?, ?, ?,?);`,
        [
          latestMessage.role,
          latestMessage.content,
          timestamp,
          activeConversationId,
        ],
      );

      // console.log("💾 Message inserted after timeout:", latestMessage.content);
    }, 600); // 2 seconds delay

    return () => clearTimeout(timeout); // cleanup on re-render
  }, [messages]);

  const startNewChat = async () => {
    try {
      const response = await conversationAPI.create({ title: "नयाँ कुराकानी" });
      // setConversations([response.data, ...conversations]);
      const newId = response.data.id;

      setActiveConversationId(newId);
      setMessages([]);
      setHistory([]);
      setSidebarVisible(false); // Close sidebar on mobile

      return newId;
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  // const comesFromHistory = async (conversationId) => {
  //   try {
  //     const rows = await db.getAllAsync(
  //       `SELECT * FROM ${tableName} WHERE session_id = ? ORDER BY id ASC`,
  //       [conversationId],
  //     );
  //     setMessages(rows);
  //     setHistory(rows);
  //     setActiveConversationId(conversationId);
  //     setLoadedFromHistory(true);
  //   } catch (error) {
  //     console.error("Failed to load conversation:", error);
  //   }
  // };

  const handleSend = async () => {
    if (!userMessage.trim()) {
      alert("Please write a message.");
      return;
    }
    let conversationId = activeConversationId;
    if (!conversationId) {
      // Create new conversation and get its ID
      conversationId = await startNewChat();
      if (!conversationId) return; // failed to create
    }

    await sendMessageToConversation(userMessage, conversationId);
  };

  const sendMessageToConversation = async (userMessage, conversationId) => {
    const userMsg = {
      role: "user",
      content: userMessage.trim(),
    };

    const updatedHistory = [...history, userMsg];

    setMessages((prev) => [...prev, userMsg]);
    setHistory(updatedHistory);
    setUserMessage("");

    try {
      setIsLoading(true);
      setAiTyping(true);

      const res = await conversationAPI.addMessage(
        activeConversationId || conversationId,
        userMessage.trim(),
        true,
      );
      console.log("RAG response:", res.data);
      // ⚠️ Adjust based on your backend response structure
      const aiText = res?.data.assistant_message.content || "No response";

      const aiMsg = {
        role: "assistant",
        content: aiText,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setHistory((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("RAG API Error:", error);
      alert("प्रश्न पठाउन असफल भयो। पुन: प्रयास गर्नुहोस्।");
    } finally {
      setIsLoading(false);
      setAiTyping(false);
    }
  };

  const handleVoiceScreen = () => {
    router.push({
      pathname: "/(chatVoiceScreen)/voice",
      params: { activeConId: activeConversationId },
    });
  };

  const loadConversations = async () => {
    try {
      const response = await conversationAPI.list();
      setConversations(response.data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const loadConversation = async (id) => {
    try {
      const response = await conversationAPI.get(id);
      setActiveConversation(response.data);
      setActiveConversationId(response.data.id);
      setMessages(response.data.messages);
      setLoadedFromHistory(true);
      setSidebarVisible(false); // Close sidebar on mobile after selection
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await conversationAPI.delete(conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));

      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
        setActiveConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      alert("कुराकानी मेटाउन असफल भयो।");
    }
  };

  const confirmDeleteConversation = (conversationId) => {
    Alert.alert(
      "सन्देश मेटाउनुहोस्",
      "के तपाईं यो सन्देश  मेटाउन निश्चित हुनुहुन्छ?",
      [
        { text: "रद्द गर्नुहोस्", style: "cancel" },
        {
          text: "मेटाउनुहोस्",
          style: "destructive",
          onPress: () => handleDeleteConversation(conversationId),
        },
      ],
      { cancelable: true },
    );
  };

  useEffect(() => {
    loadConversations();
  }, []);
  const renderItem = ({ item }) => {
    const isUser = item.role === "user";

    const speakResponse = () => {
      if (item.role === "assistant") {
        Speech.speak(item.content, { language: "ne-NP" });
        setIsSpeaking(true);
      }
    };

    const stopSpeech = () => {
      Speech.stop();
      setIsSpeaking(false);
    };

    const copyText = async () => {
      await Clipboard.setStringAsync(item.content);
      Alert.alert("Copied!", "Message copied to clipboard.");
    };

    return (
      <View
        style={{
          width: "100%",
          marginBottom: 10,
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            maxWidth: "80%",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 18,

            // 🎨 bubble style
            // backgroundColor: isUser ? "#2563EB" : "#F3F4F6",

            // 💎 shadow (premium feel)
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,

            // 🧠 chat shape
            borderTopRightRadius: isUser ? 4 : 18,
            borderTopLeftRadius: isUser ? 18 : 4,
            paddingBottom: 24,
          }}
          className={isUser ? "bg-slate-600" : "bg-gray-200"}
        >
          {/* Sender Label */}
          <Text
            className={`text-xs ${isUser ? "text-white" : "text-gray-600"}`}
          >
            {item.role === "user" ? "You" : "Assistant"}
          </Text>
          {/* Markdown */}
          <Markdown
            style={isUser ? markdownStylesUser : markdownStylesBot}
            onLinkPress={(url) => {
              Linking.openURL(url);
              return false;
            }}
          >
            {item.content}
          </Markdown>

          <View
            style={{
              position: "absolute",
              bottom: 8,
              right: 12,
              flexDirection: "row",
            }}
          >
            {/* Copy button */}
            <TouchableOpacity onPress={copyText} style={{ marginRight: 8 }}>
              <Ionicons
                name="copy-outline"
                size={20}
                color={isUser ? "#fff" : "#475569"}
              />
            </TouchableOpacity>

            {/* Assistant Mic */}
            {!isUser &&
              (isSpeaking ? (
                <TouchableOpacity onPress={stopSpeech}>
                  <Ionicons name="stop-circle-outline" size={20} color="red" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={speakResponse}
                  // style={{ marginRight: 8 }}
                >
                  <Ionicons name="mic-outline" size={20} color="#475569" />
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <SafeAreaView className="flex-1 bg-white dark:bg-black">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {/* Header */}
          <View
            style={{
              height: 74,
              // backgroundColor: "#1D4ED8",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 18,
            }}
            className="bg-slate-800 dark:bg-slate-900"
          >
            <View className="flex flex-row items-center gap-4 ">
              <TouchableOpacity
                onPress={() => setSidebarVisible(true)}
                className="bg-slate-600 p-2 rounded-lg"
              >
                <Ionicons name="menu" size={26} color="white" />
              </TouchableOpacity>

              <View className="flex items-start justify-center">
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  SevaBot Chat
                </Text>
                <Text
                  style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
                >
                  डिजिटल नागरिक वडापत्र | RAG System
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowProfileModal(true)}
              className="bg-gray-500 p-2 rounded-lg"
            >
              <Ionicons name="settings" size={26} color="white" />
            </TouchableOpacity>
          </View>

          {messages.length === 0 ? (
            // 🟢 INTRO SCREEN
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
              // className="bg-red-800"
            >
              <Image
                source={require("../../assets/images/heroImg.png")}
                style={{ width: 160, height: 160, marginBottom: 6 }}
              />

              <Text
                style={{ fontSize: 26, fontWeight: "bold" }}
                className="text-slate-600 dark:text-white"
              >
                नमस्कार! म SevaBot हुँ
              </Text>

              <Text style={{ marginTop: 2, color: "gray" }}>
                तपाईंको डिजिटल सहायक
              </Text>

              <View
                style={{
                  marginTop: 20,
                  padding: 20,
                  borderRadius: 20,
                  // backgroundColor: "#EFF6FF",
                  borderWidth: 1,
                  borderColor: "#BFDBFE",
                  width: "100%",
                }}
                className="bg-slate-200 dark:bg-black dark:text-white"
              >
                {/* Title */}
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,

                    marginBottom: 15,
                  }}
                  className="text-slate-600 dark:text-white"
                >
                  कसरी प्रयोग गर्ने:
                </Text>

                {/* Item 1 */}
                <View style={{ flexDirection: "row", marginBottom: 15 }}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={26}
                    color={theme === "dark" ? "#e5e7eb" : "#475569"}
                  />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text
                      style={{ fontWeight: "bold" }}
                      className="text-slate-600 dark:text-white"
                    >
                      १. कुराकानी सुरु गर्नुहोस्
                    </Text>
                    <Text
                      style={{
                        color: theme === "dark" ? "#9ca3af" : "#6B7280",
                        fontSize: 13,
                      }}
                    >
                      तलको box मा नेपालीमा प्रश्न लेख्नुहोस्
                    </Text>
                  </View>
                </View>

                {/* Item 2 */}
                <View style={{ flexDirection: "row", marginBottom: 15 }}>
                  <Ionicons
                    name="mic-outline"
                    size={26}
                    color={theme === "dark" ? "#e5e7eb" : "#475569"}
                  />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text
                      style={{ fontWeight: "bold" }}
                      className="text-slate-600 dark:text-white"
                    >
                      २. नेपालीमा प्रश्न सोध्नुहोस्
                    </Text>
                    <Text
                      style={{
                        color: theme === "dark" ? "#9ca3af" : "#6B7280",
                        fontSize: 13,
                      }}
                    >
                      डिजिटल नागरिक बडापत्र विषयमा प्रश्न सोध्नुहोस्
                    </Text>
                  </View>
                </View>

                {/* Item 3 */}
                <View style={{ flexDirection: "row" }}>
                  <Ionicons
                    name="information-circle-outline"
                    size={26}
                    color={theme === "dark" ? "#e5e7eb" : "#475569"}
                  />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text
                      style={{ fontWeight: "bold" }}
                      className="text-slate-600 dark:text-white"
                    >
                      ३. उत्तर पाउनुहोस्
                    </Text>
                    <Text
                      style={{
                        color: theme === "dark" ? "#9ca3af" : "#6B7280",
                        fontSize: 13,
                      }}
                    >
                      RAG प्रणालीद्वारा सही उत्तर पाउनुहोस्
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={{
                padding: 12,
                flexGrow: 1,
              }}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={true}
            />
          )}

          {aiTyping && (
            <View className=" flex-row mx-4  mb-1 animate-pulse ">
              <View className="bg-gray-200 p-2 rounded-full">
                <Text>assistant is thinking...</Text>
              </View>
            </View>
          )}

          {/* Input box */}

          <View
            style={{ paddingHorizontal: 10, paddingBottom: 4 }}
            className="bg-white dark:bg-black"
          >
            <View
              style={{
                height: 1,
                backgroundColor: theme === "dark" ? "#374151" : "#E5E7EB",
                marginBottom: 8,
              }}
            />

            {/* 🔹 Bottom Input Box */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: theme === "dark" ? "#1f2937" : "#F9FAFB",
                borderRadius: 30,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
              }}
            >
              {/* ✏️ Input */}
              <TextInput
                placeholder="आफ्नो प्रश्न नेपालीमा सोध्नुहोस्..."
                placeholderTextColor={theme === "dark" ? "#6b7280" : "#9CA3AF"}
                multiline
                value={userMessage}
                onChangeText={setUserMessage}
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: theme === "dark" ? "#f3f4f6" : "#111827",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  maxHeight: 100,
                }}
              />

              {/* 🎤 MIC */}
              <TouchableOpacity
                onPress={handleVoiceScreen}
                style={{ marginHorizontal: 12 }}
              >
                <Ionicons
                  name="mic-outline"
                  size={28}
                  color={theme === "dark" ? "#9ca3af" : "#475569"}
                />
              </TouchableOpacity>

              {/* 📩 SEND BUTTON */}
              <TouchableOpacity
                onPress={() => {
                  handleSend();
                  Keyboard.dismiss(); // 👈 close keyboard
                }}
                disabled={!userMessage.trim()}
                style={{
                  padding: 10,

                  opacity: userMessage.trim() ? 1 : 0.5,
                }}
                className="rounded-lg bg-slate-800"
              >
                <Feather name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {/* sidebar for history */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        startNewChat={startNewChat}
        // comesFromHistory={comesFromHistory}
        conversations={conversations}
        activeConversation={activeConversation}
        onDeleteConversation={confirmDeleteConversation}
        onSelectConversation={loadConversation}
        loadConversations={loadConversations}
      />
      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

export default ChatScreen;

const markdownStylesUser = {
  text: {
    color: "#FFFFFF",
    fontSize: scale(15),
  },
  heading1: { fontSize: scale(20), fontWeight: "bold", color: "white" },
  code_inline: {
    backgroundColor: "#ddd",
    color: "#222",
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  link: {
    color: "#93c5fd",
    textDecorationLine: "underline",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  th: {
    backgroundColor: "#f0f0f0",
    padding: 6,
  },
  td: {
    padding: 6,
  },
};

const markdownStylesBot = {
  body: { color: "black", fontSize: 16 },

  code_inline: {
    backgroundColor: "rgba(0,0,0,0.3)",
    color: "black",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },

  code_block: {
    backgroundColor: "rgba(0,0,0,0.3)",
    color: "black",
    padding: 12,
    borderRadius: 8,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  fence: {
    backgroundColor: "rgba(0,0,0,0.3)",
    color: "white",
    padding: 12,
    borderRadius: 8,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  table: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    borderRadius: 6,
    marginVertical: 8,
    // overflow: "hidden",
    minWidth: 280,
  },
  thead: { backgroundColor: "rgba(0,0,0,0.4)" },

  th: {
    // backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    color: "white",
  },

  tr: {
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    flexwrap: "nowrap",
  },

  td: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    color: "white",
    // backgroundColor: "rgba(0,0,0,0.3)",
  },

  tbody: { backgroundColor: "rgba(0,0,0,0.3)" },

  heading1: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  heading2: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 6,
  },
  heading3: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  },

  list_item: { color: "black", marginBottom: 4 },

  link: { color: "rgb(33, 150, 243)", textDecorationLine: "underline" },

  blockquote: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "rgba(255,255,255,0.3)",
    padding: 8,
    marginVertical: 8,
  },

  hr: {
    backgroundColor: "rgba(255,255,255,0.2)",
    height: 1,
    marginVertical: 12,
  },
};
