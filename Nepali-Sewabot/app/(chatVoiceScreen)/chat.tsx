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
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import { scale } from "react-native-size-matters";
import axios from "axios";
import * as SQLite from "expo-sqlite";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const db = SQLite.openDatabaseSync("chat.db");

const ChatScreen = () => {
  const router = useRouter();
  const flatListRef = useRef(null);
  const { firstMessage, sessionId, sessionIdFromHistory } =
    useLocalSearchParams();

  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  const [userMessage, setUserMessage] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [hasUsedFirstMessage, setHasUsedFirstMessage] = useState(false);
  const [loadedFromHistory, setLoadedFromHistory] = useState(false);

  const { currentUser } = useCurrentUser();
  const tableName = `messages_${currentUser?._id}`;

  //scroll to bottom when new message arrives
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  // load messages from the history component which matches sessionId
  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionIdFromHistory) return;
      const rows = await db.getAllAsync(
        `SELECT * FROM ${tableName} WHERE session_id = ? ORDER BY id ASC`,
        [sessionIdFromHistory],
      );
      setMessages(rows);
      setHistory(rows);
      setLoadedFromHistory(true); // ✅ Prevent saving for these
    };

    loadMessages();
  }, [sessionIdFromHistory]);

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
          latestMessage.sender,
          latestMessage.content,
          timestamp,
          sessionId || sessionIdFromHistory,
        ],
      );

      // console.log("💾 Message inserted after timeout:", latestMessage.content);
    }, 600); // 2 seconds delay

    return () => clearTimeout(timeout); // cleanup on re-render
  }, [messages]);

  useEffect(() => {
    fetchFirstMessages();
  }, [firstMessage]);

  const fetchFirstMessages = async () => {
    if (!firstMessage || hasUsedFirstMessage) return;

    const firstMsg = {
      sender: "user",
      content: firstMessage,
    };

    const updatedHistory = [...history, firstMsg];

    // Add user message to UI and state ...
    setMessages((prev) => [...prev, firstMsg]);
    setHistory(updatedHistory);

    try {
      setIsLoading(true);
      setAiTyping(true);

      const aiResponse = await sendToGpt(updatedHistory);

      const aiMsg = {
        sender: "assistant",
        content: aiResponse,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setHistory((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error on firstMessage GPT:", error);
    } finally {
      setIsLoading(false);
      setAiTyping(false);
      setHasUsedFirstMessage(true);
    }
  };

  const handleSend = async () => {
    if (!userMessage.trim()) {
      alert("Please write a message.");
      return;
    }

    const userMsg = {
      sender: "user",
      content: userMessage.trim(),
    };

    const updatedHistory = [...history, userMsg];

    // Add user message to UI and state
    setMessages((prev) => [...prev, userMsg]);
    setHistory(updatedHistory);
    // console.log("Messages:", messages);
    // console.log("History:", history);
    setUserMessage(""); // Clear input

    try {
      setIsLoading(true);
      setAiTyping(true);

      const aiResponse = await sendToGpt(updatedHistory);

      const aiMsg = {
        sender: "assistant",
        content: aiResponse,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setHistory((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      console.error("GPT API Error:", error);
      alert("Something went wrong while contacting AI.");
    } finally {
      setIsLoading(false);
      setAiTyping(false);
    }
  };

  const sendToGpt = async (updatedHistory) => {
    const formattedMessages = updatedHistory.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    const APIKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    // console.log(APIKey);

    if (!APIKey) {
      alert("Error: No API key found");
      return;
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/responses",
        {
          model: "gpt-4o-mini",
          input: [
            {
              role: "system",
              content:
                "You are AI Assistant, a helpful and friendly assistant. If the question is in Nepali, answer in both Nepali and English (Nepali first). If it's in English, reply only in English.",
            },
            ...formattedMessages,
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${APIKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.output[0].content[0].text;
    } catch (err) {
      console.log("GPT API Error:", err.response?.data || err);
      throw err;
    }
  };
  const handleVoiceScreen = () => {
    if (sessionId) {
      router.push({
        pathname: "/(chatVoiceScreen)/voice",
        params: { sessionId },
      });
    } else {
      router.push({
        pathname: "/(chatVoiceScreen)/voice",
        params: { sessionIdFromHistory },
      });
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === "user";

    return (
      <View
        className={`w-full mb-3 flex ${isUser ? "items-end" : "items-start"}`}
      >
        <View
          className={`px-3 py-2 rounded-2xl max-w-[85%] ${
            isUser ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          {/* Sender Label */}
          <Text
            className={`text-xs ${isUser ? "text-white" : "text-gray-600"}`}
          >
            {item.sender.toUpperCase()}
          </Text>

          {/* Markdown Renderer */}

          <Markdown
            style={isUser ? markdownStylesUser : markdownStylesBot}
            onLinkPress={(url) => {
              Linking.openURL(url);
              return false;
            }}
          >
            {item.content}
          </Markdown>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text className="text-center text-lg text-gray-700">
            Chat With Nepali SewaBot
          </Text>
          <TouchableOpacity>
            <Ionicons name="menu" color="black" size={24} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
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

        {aiTyping && (
          <View className=" flex-row mx-4  ">
            <View className="bg-gray-200 p-2 rounded-full">
              <Text>AI is thinking...</Text>
            </View>
          </View>
        )}

        {/* Input box */}

        <View className="h-[70px] border border-gray-300 rounded-2xl px-2 flex-row items-center mx-2 my-2">
          <TextInput
            placeholder="Ask anything..."
            multiline
            numberOfLines={2}
            value={userMessage}
            onChangeText={setUserMessage}
            className="flex-1 text-black bg-gray-100 p-4 rounded-3xl text-base max-h-[120px] min-h-[40px]"
            style={{ outlineWidth: 0 }} // keep this for web
          />

          {userMessage.trim().length > 0 ? (
            <TouchableOpacity
              onPress={handleSend}
              // disabled={userMessage.trim().length === 0}
              className="ml-2 p-2 bg-gray-300 rounded-full"
            >
              <Ionicons name="send" size={30} color="#1DA1F2" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleVoiceScreen}
              className="ml-2 p-2 bg-gray-300 rounded-full"
            >
              <Ionicons name="mic" size={30} color="#1DA1F2" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
