// const AAI_KEY = "6ed06e41dd4a42fb829dbb40c9ec3439";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "react-native-size-matters";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import axios from "axios";
import Regenerate from "@/assets/svgs/regenerate";
import Reload from "@/assets/svgs/reload";

import * as SQLite from "expo-sqlite";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { conversationAPI } from "@/utils/api_rag";
import { useTheme } from "@/context/ThemeContext";

const db = SQLite.openDatabaseSync("chat.db");

const AAI_KEY = "6ed06e41dd4a42fb829dbb40c9ec3439"; // 🔐 move to env in production

const VoiceScreen = () => {
  const router = useRouter();
  const { sessionId, sessionIdFromHistory, activeConId } =
    useLocalSearchParams();
  console.log(activeConId);

  const { theme } = useTheme();

  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(activeConId ? parseInt(activeConId) : null);

  const lottieRef = useRef<LottieView>(null);
  const isCancelled = useRef(false);

  const [text, setText] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [AIResponse, setAIResponse] = useState(false);

  const [AISpeaking, setAISpeaking] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  const { currentUser } = useCurrentUser();
  const tableName = `messages_${currentUser?._id}`;

  useEffect(() => {
    const backAction = () => {
      isCancelled.current = true;
      if (isRecording) {
        cancelRecording(); // your cancel function
        return true; // prevent default back action
      }
      return false; // allow normal back
    };

    stopSpeaking();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [isRecording, recording]);

  useEffect(() => {
    isCancelled.current = false;
  }, []);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("अनुमति आवश्यक छ", "माइक्रोफोन पहुँच आवश्यक छ");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      await rec.startAsync();

      setRecording(rec);
      setIsRecording(true);
      setText("");
    } catch (err) {
      console.log("Start recording error:", err);
      Alert.alert("असफल", "रेकर्डिङ सुरु गर्न असफल भयो।");
      setIsRecording(false);
    }
  };

  /* -------------------- STOP RECORDING -------------------- */
  const stopRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      setLoading(true);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) throw new Error("कुनै अडियो फाइल छैन");
      setUserMessage("");
      const transcript = await speechToText(uri);
      setText(
        transcript || "केहि सुन्न सकिएन ।कृपया फेरी प्रायस गर्नु होला । ",
      );
      setUserMessage(transcript);
      const userMsg = {
        role: "user",
        content: transcript.trim(),
      };

      const updatedHistory = [...history, userMsg];

      // Add user message to UI and state
      setMessages((prev) => [...prev, userMsg]);
      setHistory(updatedHistory);

      let conversationId = activeConversationId;
      if (!conversationId) {
        // Create new conversation and get its ID
        conversationId = await startNewChat();
        if (!conversationId) return; // failed to create
      }

      await sendMessageToConversation(transcript, conversationId);
    } catch (err: any) {
      console.log("Stop recording error:", err.message);

      Alert.alert("त्रुटि", err.message);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = async () => {
    try {
      const response = await conversationAPI.create({ title: "नयाँ कुराकानी" });
      // setConversations([response.data, ...conversations]);
      const newId = response.data.id;

      setActiveConversationId(newId);

      return newId;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      Alert.alert("त्रुटि", "नयाँ च्याट बनाउन सकिएन");
    }
  };

  const sendMessageToConversation = async (transcript, conversationId) => {
    try {
      if (isCancelled.current) return;
      const res = await conversationAPI.addMessage(
        conversationId,
        transcript.trim(),
        true,
      );
      // console.log("RAG response:", res.data);
      // ⚠️ Adjust based on your backend response structure
      const aiText = res?.data.assistant_message.content || "No response";

      const aiMsg = {
        role: "assistant",
        content: aiText,
      };
      setLoading(false);
      setText(aiText);
      setAIResponse(true);
      await speakText(aiText);

      setMessages((prev) => [...prev, aiMsg]);
      setHistory((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("RAG API Error:", error);
      alert("प्रश्न पठाउन असफल भयो। पुन: प्रयास गर्नुहोस्।");
    }
  };
  /* -------------------- SPEECH TO TEXT -------------------- */
  const speechToText = async (uri: string) => {
    try {
      /* 1️⃣ Upload audio (CORRECT WAY FOR EXPO) */
      const audioRes = await fetch(uri);
      const arrayBuffer = await audioRes.arrayBuffer();

      // const AAI_KEY = process.env.ASSEMBLYAI_KEY;
      // console.log("AAI_KEY:", AAI_KEY);
      const uploadRes = await axios.post(
        "https://api.assemblyai.com/v2/upload",
        arrayBuffer,
        {
          headers: {
            authorization: AAI_KEY,
            "content-type": "application/octet-stream",
          },
        },
      );

      /* 2️⃣ Create transcript */
      const transcriptRes = await axios.post(
        "https://api.assemblyai.com/v2/transcript",
        {
          audio_url: uploadRes.data.upload_url,
          language_detection: true,
          punctuate: true,
          format_text: true,
        },
        {
          headers: {
            authorization: AAI_KEY,
            "content-type": "application/json",
          },
        },
      );

      const transcriptId = transcriptRes.data.id;

      /* 3️⃣ Poll result */
      while (true) {
        const res = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          { headers: { authorization: AAI_KEY } },
        );

        if (res.data.status === "completed") {
          return res.data.text;
        }

        if (res.data.status === "error") {
          console.log("AssemblyAI FULL ERROR:", res.data);
          throw new Error(res.data.error);
        }

        await new Promise((r) => setTimeout(r, 3000));
      }
    } catch (err: any) {
      console.log("AssemblyAI error:", err.message);
      return "";
    }
  };

  const speakText = async (text: string) => {
    if (isCancelled.current) return;
    setAISpeaking(true);
    const options = {
      voice: "com.apple.ttsbundle.Samantha-compact",
      language: "ne-NP",
      pitch: 1.5,
      rate: 1,
      onDone: () => {
        setAISpeaking(false);
      },
    };
    Speech.speak(text, options);
  };

  const stopSpeaking = () => {
    Speech.stop();
    setAISpeaking(false);
  };

  /* -------------------- CANCEL RECORDING -------------------- */
  const cancelRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      setRecording(null);
      setIsRecording(false);
      setLoading(false);
      setText("");

      console.log("Recording cancelled");
    } catch (err) {
      console.log("Cancel recording error:", err);
    }
  };

  // save chat messages to asyncStorage for offline use
  useEffect(() => {
    if (!messages.length) return;

    const latestMessage = messages[messages.length - 1];

    const timeout = setTimeout(() => {
      const timestamp = new Date().toISOString();

      db.runSync(
        `INSERT INTO ${tableName} (sender, content, timestamp,session_id) VALUES (?, ?, ?,?);`,
        [
          latestMessage.role,
          latestMessage.content,
          timestamp,
          activeConversationId || activeConId,
        ],
      );

      // console.log("💾 Message inserted after timeout:", latestMessage.content);
    }, 600); // 2 seconds delay

    return () => clearTimeout(timeout); // cleanup on re-render
  }, [messages]);
  /* -------------------- UI -------------------- */
  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-black" : "bg-white"}`}
      edges={["top"]}
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
        className={theme === "dark" ? "bg-gray-900" : "bg-slate-800"}
      >
        <View className="flex flex-row items-center gap-4 ">
          <TouchableOpacity
            onPress={async () => {
              isCancelled.current = true;
              router.back();
              cancelRecording();
              stopSpeaking();
              return;
            }}
            className={
              theme === "dark"
                ? "bg-gray-700 p-2 rounded-lg"
                : "bg-slate-600 p-2 rounded-lg"
            }
          >
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>

          <View className="flex items-start justify-center">
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              SevaBot Chat
            </Text>
            <Text
              style={{
                color: theme === "dark" ? "#d1d5db" : "white",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              डिजिटल नागरिक वडापत्र | RAG System
            </Text>
          </View>
        </View>

        {/* <TouchableOpacity
          // onPress={() => setShowProfileModal(true)}
          className="bg-gray-500 p-2 rounded-lg"
        >
          <Ionicons name="settings" size={26} color="white" />
        </TouchableOpacity> */}
      </View>

      <View className="flex-1 justify-center items-center -mt-60 ">
        <View>
          {loading ? (
            <TouchableOpacity>
              <LottieView
                source={require("@/assets/animations/loading.json")}
                autoPlay
                loop
                speed={1.3}
                style={{ width: scale(270), height: scale(270) }}
              />
            </TouchableOpacity>
          ) : (
            <>
              {!isRecording ? (
                <>
                  {AIResponse ? (
                    <View style={{}}>
                      <LottieView
                        ref={lottieRef}
                        source={require("@/assets/animations/ai-speaking.json")}
                        autoPlay={AISpeaking}
                        loop={AISpeaking}
                        // speed={1.3}
                        style={{ width: scale(250), height: scale(250) }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setAIResponse(false);
                          setIsRecording(false);
                          setText("");
                          startRecording();
                          stopSpeaking();
                        }}
                        style={{
                          // flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          top: -70,
                        }}
                      >
                        <Ionicons
                          name="mic"
                          size={30}
                          color={theme === "dark" ? "white" : "black"}
                        />
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 20,
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          फेरि सोध्नुहोस्...
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={startRecording}
                      style={{
                        width: scale(110),
                        height: scale(110),
                        borderRadius: scale(100),
                        // backgroundColor: "gray",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 2,
                        borderColor: theme === "dark" ? "#60a5fa" : "#2b3356",
                      }}
                      // className="bg-gray-300"
                    >
                      <Ionicons
                        name="mic"
                        size={80}
                        color={theme === "dark" ? "#60a5fa" : "#2b3356"}
                      />
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <TouchableOpacity onPress={stopRecording}>
                  <LottieView
                    source={require("@/assets/animations/animation.json")}
                    autoPlay
                    loop
                    speed={1.3}
                    style={{ width: scale(250), height: scale(250) }}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Text Output */}
        <View
          style={{
            position: "absolute",
            width: scale(320),
            bottom: isRecording ? verticalScale(80) : verticalScale(140),
          }}
          className=""
        >
          <ScrollView
            className={
              theme === "dark"
                ? "bg-gray-800 rounded-xl max-h-60"
                : "bg-slate-200 rounded-xl max-h-60"
            }
            contentContainerStyle={{ padding: 16 }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                color: theme === "dark" ? "white" : "black",
              }}
            >
              {loading
                ? text
                : isRecording
                  ? text || "रेकर्डिङ रोक्न माइक थिच्नुहोस्!"
                  : text || "माइक थिच्नुहोस् र बोल्नुहोस् "}
            </Text>
          </ScrollView>

          {isRecording && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: verticalScale(20),
              }}
            >
              <TouchableOpacity
                onPress={cancelRecording}
                className="rounded-full border-2 p-3 border-red-600"
              >
                <Ionicons name="stop" size={30} color="red" className="" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* buttons */}
        {AIResponse && (
          <View
            style={{
              position: "absolute",
              bottom: verticalScale(60),
              left: scale(0),
              paddingHorizontal: scale(30),
              flexDirection: "row",
              justifyContent: "space-between",
              width: scale(360),
            }}
          >
            <TouchableOpacity
              disabled={AISpeaking}
              onPress={() => {
                setLoading(true);
                sendMessageToConversation(userMessage, activeConversationId);
              }}
            >
              <Regenerate />
            </TouchableOpacity>

            {AISpeaking && (
              <TouchableOpacity
                onPress={stopSpeaking}
                style={{
                  width: scale(50),
                  height: scale(50),
                  borderRadius: 100,
                  borderWidth: 2,
                  borderColor: "red",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="stop" size={30} color="red" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={AISpeaking}
              onPress={() => speakText(text)}
            >
              <Reload />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default VoiceScreen;
