// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Image,
//   Text,
//   TouchableOpacity,
//   View,
//   TextInput,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const suggestions = [
//   { label: "📄 Apply Citizenship" },
//   { label: "🛂 Renew Passport" },
//   { label: "💰 Social Aid Info" },
//   { label: "🏢 Ward Office Contact" },
// ];

// // Generate a new session ID (timestamp-based)
// const generateSessionId = () => Date.now().toString();

// const HomeScreen = () => {
//   const router = useRouter();

//   const { currentUser: user, isLoading: loading } = useCurrentUser();

//   const [input, setInput] = useState("");

//   const handleSendOrVoice = () => {
//     const sessionId = generateSessionId();
//     if (input.trim()) {
//       // Navigate to chat screen with user input
//       router.push({
//         pathname: "/(chatVoiceScreen)/chat",
//         params: { firstMessage: input },
//       });

//       setInput("");
//     } else {
//       // Navigate to voice screen if input is empty
//       // router.push("/screens/voiceScreen");
//       router.push({
//         pathname: "/(chatVoiceScreen)/voice",
//         params: { sessionId },
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 bg-white dark:bg-black items-center justify-center">
//         <ActivityIndicator size="large" color="#1DA1F2" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-white dark:bg-black">
//       {/* Header */}
//       <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
//         <Text className="text-xl font-bold text-gray-900 dark:text-white">
//           Nepali Sewabot
//         </Text>

//         <TouchableOpacity onPress={() => router.push("/profile")}>
//           <Image
//             source={{ uri: user?.profilePicture }}
//             className="w-9 h-9 rounded-full"
//           />
//         </TouchableOpacity>
//       </View>

//       {/* KEYBOARD AVOIDING */}
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "padding"}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
//       >
//         <ScrollView
//           className="flex-1 px-4"
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//           contentContainerStyle={{
//             flexGrow: 1,
//             paddingBottom: 20,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           {/* Title */}
//           <Text className="text-2xl  font-semibold text-gray-900 dark:text-white mb-6 text-center">
//             What can I help with?
//           </Text>

//           {/* Suggestion Chips */}
//           <View className="flex-row flex-wrap justify-center gap-3 mb-10">
//             {suggestions.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 className="px-4 py-2 rounded-full bg-gray-600 dark:bg-gray-200"
//                 onPress={() => setInput(item.label)}
//               >
//                 <Text className="dark:text-gray-900 text-white font-medium">
//                   {item.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* INPUT FIELD */}
//           <View className="w-full bg-gray-300 dark:bg-gray-800 rounded-2xl px-4 py-2 flex-row items-center">
//             <TextInput
//               placeholder="Ask anything..."
//               placeholderTextColor="#A1A1AA"
//               multiline
//               numberOfLines={3}
//               className="flex-1 outline-none text-gray-900 dark:text-white text-lg"
//               value={input}
//               onChangeText={setInput}
//             />

//             <TouchableOpacity onPress={handleSendOrVoice}>
//               <Ionicons
//                 name={input.trim() ? "send" : "mic"}
//                 size={26}
//                 color="#1DA1F2"
//               />
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "expo-router";

// export default function HomeScreen() {
//   const navigation = useNavigation();

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const sendMessage = () => {
//     if (!input.trim()) return;

//     const newMsg = {
//       id: Date.now().toString(),
//       text: input,
//       role: "user",
//     };

//     setMessages((prev) => [...prev, newMsg]);
//     setInput("");

//     // simulate bot
//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now().toString(),
//           text: "यो demo उत्तर हो",
//           role: "assistant",
//         },
//       ]);
//     }, 800);
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "#fff" }}>
//       {/* 🔵 HEADER */}
//       <View
//         style={{
//           height: 80,
//           backgroundColor: "#1D4ED8",
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//           paddingHorizontal: 15,
//         }}
//       >
//         <TouchableOpacity onPress={() => navigation.openDrawer()}>
//           <Ionicons name="menu" size={26} color="white" />
//         </TouchableOpacity>

//         <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
//           SevaBot
//         </Text>

//         <TouchableOpacity>
//           <Ionicons name="settings" size={24} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* 🟡 BODY + KEYBOARD HANDLING */}
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={80}
//       >
//         {messages.length === 0 ? (
//           // 🟢 INTRO SCREEN (LIKE IMAGE)
//           <View
//             style={{
//               flex: 1,
//               justifyContent: "center",
//               alignItems: "center",
//               padding: 20,
//             }}
//           >
//             <Image
//               source={require("../../assets/images/heroImg.png")} // use your logo
//               style={{ width: 120, height: 120, marginBottom: 20 }}
//               resizeMode="contain"
//             />

//             <Text
//               style={{ fontSize: 22, fontWeight: "bold", color: "#1D4ED8" }}
//             >
//               नमस्कार! म SevaBot हुँ
//             </Text>

//             <Text style={{ marginTop: 10, color: "gray" }}>
//               डिजिटल नागरिक बडापत्र
//             </Text>

//             {/* INFO BOX */}
//             <View
//               style={{
//                 marginTop: 30,
//                 padding: 20,
//                 borderRadius: 15,
//                 backgroundColor: "#F1F5F9",
//                 width: "100%",
//               }}
//             >
//               <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
//                 कसरी प्रयोग गर्ने:
//               </Text>

//               <Text>१. कुराकानी सुरु गर्नुहोस्</Text>
//               <Text>२. नेपालीमा प्रश्न सोध्नुहोस्</Text>
//               <Text>३. उत्तर प्राप्त गर्नुहोस्</Text>
//             </View>
//           </View>
//         ) : (
//           // 🔵 CHAT UI
//           <FlatList
//             data={messages}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={{ padding: 10 }}
//             renderItem={({ item }) => (
//               <View
//                 style={{
//                   alignSelf: item.role === "user" ? "flex-end" : "flex-start",
//                   backgroundColor: item.role === "user" ? "#2563EB" : "#E5E7EB",
//                   padding: 10,
//                   borderRadius: 10,
//                   marginVertical: 5,
//                   maxWidth: "80%",
//                 }}
//               >
//                 <Text
//                   style={{
//                     color: item.role === "user" ? "white" : "black",
//                   }}
//                 >
//                   {item.text}
//                 </Text>
//               </View>
//             )}
//           />
//         )}

//         {/* 🟢 INPUT BOX */}
//         <View
//           style={{
//             flexDirection: "row",
//             padding: 10,
//             borderTopWidth: 1,
//             borderColor: "#ddd",
//           }}
//         >
//           <TextInput
//             value={input}
//             onChangeText={setInput}
//             placeholder="आफ्नो प्रश्न लेख्नुहोस्..."
//             style={{
//               flex: 1,
//               borderWidth: 1,
//               borderColor: "#ccc",
//               borderRadius: 25,
//               paddingHorizontal: 15,
//             }}
//           />

//           <TouchableOpacity onPress={sendMessage}>
//             <Ionicons
//               name="send"
//               size={24}
//               color="#2563EB"
//               style={{ marginLeft: 10 }}
//             />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

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
// import { useSendMessage } from "@/hooks/useSendMessage";
import { conversationAPI } from "@/utils/api_rag";
import Sidebar from "@/components/Sidebar";

const db = SQLite.openDatabaseSync("chat.db");

const ChatScreen = () => {
  const router = useRouter();
  const flatListRef = useRef(null);

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const { firstMessage, sessionIdFromHistory } = useLocalSearchParams();

  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);

  const [userMessage, setUserMessage] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [hasUsedFirstMessage, setHasUsedFirstMessage] = useState(false);
  const [loadedFromHistory, setLoadedFromHistory] = useState(false);

  const { currentUser } = useCurrentUser();
  const tableName = `messages_${currentUser?._id}`;

  // const { sendMessage, loading } = useSendMessage();

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
      setActiveConversationId(sessionIdFromHistory);
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
          activeConversationId || sessionIdFromHistory,
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

    setMessages((prev) => [...prev, firstMsg]);
    setHistory(updatedHistory);

    try {
      setIsLoading(true);
      setAiTyping(true);

      const response = await conversationAPI.create({ title: "नयाँ कुराकानी" });
      setActiveConversationId(response.data.id);
      const res = await conversationAPI.addMessage(
        // sessionId || sessionIdFromHistory || 1,
        activeConversationId || sessionIdFromHistory,
        userMessage.trim(),
        true,
      );

      const aiText = res?.data.assistant_message.content || "No response";

      const aiMsg = {
        sender: "assistant",
        content: aiText,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setHistory((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("RAG first message error:", error);
    } finally {
      setIsLoading(false);
      setAiTyping(false);
      setHasUsedFirstMessage(true);
    }
  };

  // const fetchFirstMessages = async () => {
  //   if (!firstMessage || hasUsedFirstMessage) return;

  //   const firstMsg = {
  //     sender: "user",
  //     content: firstMessage,
  //   };

  //   const updatedHistory = [...history, firstMsg];

  //   // Add user message to UI and state ...
  //   setMessages((prev) => [...prev, firstMsg]);
  //   setHistory(updatedHistory);

  //   try {
  //     setIsLoading(true);
  //     setAiTyping(true);

  //     const aiResponse = await sendToGpt(updatedHistory);

  //     const aiMsg = {
  //       sender: "assistant",
  //       content: aiResponse,
  //     };

  //     setMessages((prev) => [...prev, aiMsg]);
  //     setHistory((prev) => [...prev, aiMsg]);
  //   } catch (error) {
  //     console.error("Error on firstMessage GPT:", error);
  //   } finally {
  //     setIsLoading(false);
  //     setAiTyping(false);
  //     setHasUsedFirstMessage(true);
  //   }
  // };

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

    setMessages((prev) => [...prev, userMsg]);
    setHistory(updatedHistory);
    setUserMessage("");

    try {
      setIsLoading(true);
      setAiTyping(true);

      // ✅ CALL YOUR RAG BACKEND
      // const res = await sendMessage(
      //   sessionId || sessionIdFromHistory || 1, // conversation id
      //   userMessage.trim(),
      //   true, // use RAG
      // );
      const res = await conversationAPI.addMessage(
        // sessionId || sessionIdFromHistory || 1,
        activeConversationId || sessionIdFromHistory,
        userMessage.trim(),
        true,
      );
      console.log("RAG response:", res.data);
      // ⚠️ Adjust based on your backend response structure
      const aiText = res?.data.assistant_message.content || "No response";

      const aiMsg = {
        sender: "assistant",
        content: aiText,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setHistory((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("RAG API Error:", error);
      alert("Something went wrong while contacting AI.");
    } finally {
      setIsLoading(false);
      setAiTyping(false);
    }
  };

  // const handleSend = async () => {
  //   if (!userMessage.trim()) {
  //     alert("Please write a message.");
  //     return;
  //   }

  //   const userMsg = {
  //     sender: "user",
  //     content: userMessage.trim(),
  //   };

  //   const updatedHistory = [...history, userMsg];

  //   // Add user message to UI and state
  //   setMessages((prev) => [...prev, userMsg]);
  //   setHistory(updatedHistory);
  //   // console.log("Messages:", messages);
  //   // console.log("History:", history);
  //   setUserMessage(""); // Clear input

  //   try {
  //     setIsLoading(true);
  //     setAiTyping(true);

  //     const aiResponse = await sendToGpt(updatedHistory);

  //     const aiMsg = {
  //       sender: "assistant",
  //       content: aiResponse,
  //     };

  //     setMessages((prev) => [...prev, aiMsg]);
  //     setHistory((prev) => [...prev, aiMsg]);
  //   } catch (error: any) {
  //     console.error("GPT API Error:", error);
  //     alert("Something went wrong while contacting AI.");
  //   } finally {
  //     setIsLoading(false);
  //     setAiTyping(false);
  //   }
  // };

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
    if (activeConversationId) {
      router.push({
        pathname: "/(chatVoiceScreen)/voice",
        params: { activeConversationId },
      });
    } else {
      router.push({
        pathname: "/(chatVoiceScreen)/voice",
        params: { sessionIdFromHistory },
      });
    }
  };

  // const renderItem = ({ item }) => {
  //   const isUser = item.sender === "user";

  //   return (
  //     <View
  //       className={`w-full mb-3 flex ${isUser ? "items-end" : "items-start"}`}
  //     >
  //       <View
  //         className={`px-3 py-2 rounded-2xl max-w-[85%] ${
  //           isUser ? "bg-blue-500" : "bg-gray-200"
  //         }`}
  //       >
  //         {/* Sender Label */}
  //         <Text
  //           className={`text-xs ${isUser ? "text-white" : "text-gray-600"}`}
  //         >
  //           {item.sender.toUpperCase()}
  //         </Text>

  //         {/* Markdown Renderer */}

  //         <Markdown
  //           style={isUser ? markdownStylesUser : markdownStylesBot}
  //           onLinkPress={(url) => {
  //             Linking.openURL(url);
  //             return false;
  //           }}
  //         >
  //           {item.content}
  //         </Markdown>
  //       </View>
  //     </View>
  //   );
  // };
  const renderItem = ({ item }) => {
    const isUser = item.sender === "user";

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
          }}
          className={isUser ? "bg-blue-500" : "bg-gray-200"}
        >
          {/* Sender Label */}
          <Text
            className={`text-xs ${isUser ? "text-white" : "text-gray-600"}`}
          >
            {item.sender === "user" ? "You" : "Assistant"}
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
        </View>
      </View>
    );
  };
  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
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
            className="bg-blue-700"
          >
            <View className="flex flex-row items-center gap-4 ">
              <TouchableOpacity
                onPress={() => setSidebarVisible(true)}
                className="bg-blue-500 p-2 rounded-lg"
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

            <TouchableOpacity className="bg-gray-500 p-2 rounded-lg">
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
                style={{ fontSize: 26, fontWeight: "bold", color: "#1D4ED8" }}
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
                  backgroundColor: "#EFF6FF",
                  borderWidth: 1,
                  borderColor: "#BFDBFE",
                  width: "100%",
                }}
              >
                {/* Title */}
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "#1E3A8A",
                    marginBottom: 15,
                  }}
                >
                  कसरी प्रयोग गर्ने:
                </Text>

                {/* Item 1 */}
                <View style={{ flexDirection: "row", marginBottom: 15 }}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={26}
                    color="#1D4ED8"
                  />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontWeight: "bold", color: "#1E40AF" }}>
                      १. कुराकानी सुरु गर्नुहोस्
                    </Text>
                    <Text style={{ color: "#6B7280", fontSize: 13 }}>
                      तलको box मा नेपालीमा प्रश्न लेख्नुहोस्
                    </Text>
                  </View>
                </View>

                {/* Item 2 */}
                <View style={{ flexDirection: "row", marginBottom: 15 }}>
                  <Ionicons name="mic-outline" size={26} color="#1D4ED8" />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontWeight: "bold", color: "#1E40AF" }}>
                      २. नेपालीमा प्रश्न सोध्नुहोस्
                    </Text>
                    <Text style={{ color: "#6B7280", fontSize: 13 }}>
                      डिजिटल नागरिक बडापत्र विषयमा प्रश्न सोध्नुहोस्
                    </Text>
                  </View>
                </View>

                {/* Item 3 */}
                <View style={{ flexDirection: "row" }}>
                  <Ionicons
                    name="information-circle-outline"
                    size={26}
                    color="#1D4ED8"
                  />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontWeight: "bold", color: "#1E40AF" }}>
                      ३. उत्तर पाउनुहोस्
                    </Text>
                    <Text style={{ color: "#6B7280", fontSize: 13 }}>
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
            <View className=" flex-row mx-4  ">
              <View className="bg-gray-200 p-2 rounded-full">
                <Text>assistant is thinking...</Text>
              </View>
            </View>
          )}

          {/* Input box */}

          <View
            style={{ paddingHorizontal: 10, paddingBottom: 4 }}
            className="bg-white"
          >
            {/* 🔹 Top Border Line */}
            <View
              style={{
                height: 1,
                backgroundColor: "#E5E7EB",
                marginBottom: 8,
              }}
            />

            {/* 🔹 Bottom Input Box */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F9FAFB",
                borderRadius: 30,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              {/* ✏️ Input */}
              <TextInput
                placeholder="आफ्नो प्रश्न नेपालीमा सोध्नुहोस्..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={userMessage}
                onChangeText={setUserMessage}
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: "#111827",
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
                <Ionicons name="mic-outline" size={28} color="#2563EB" />
              </TouchableOpacity>

              {/* 📩 SEND BUTTON */}
              <TouchableOpacity
                onPress={handleSend}
                disabled={!userMessage.trim()}
                style={{
                  padding: 10,

                  opacity: userMessage.trim() ? 1 : 0.5,
                }}
                className="rounded-lg bg-blue-500"
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
