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
import { useAuthStore } from "@/utils/authStore";

const db = SQLite.openDatabaseSync("chat.db");

const AAI_KEY = "6ed06e41dd4a42fb829dbb40c9ec3439"; // 🔐 move to env in production

const VoiceScreen = () => {
  const router = useRouter();
  const { sessionId, sessionIdFromHistory } = useLocalSearchParams();
  const lottieRef = useRef<LottieView>(null);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [AIResponse, setAIResponse] = useState(false);

  const [AISpeaking, setAISpeaking] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  // const { currentUser } = useCurrentUser();
  const { user } = useAuthStore();
  const tableName = `messages_${user?._id}`;

  useEffect(() => {
    const backAction = () => {
      if (isRecording) {
        cancelRecording(); // your cancel function
        return true; // prevent default back action
      }
      return false; // allow normal back
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isRecording, recording]);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission required", "Microphone access needed");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await rec.startAsync();

      setRecording(rec);
      setIsRecording(true);
      setText("");
    } catch (err) {
      console.log("Start recording error:", err);
      alert("Failed to start recording.");
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

      if (!uri) throw new Error("No audio file");

      const transcript = await speechToText(uri);
      setText(transcript || "No speech detected");

      const userMsg = {
        sender: "user",
        content: transcript.trim(),
      };

      const updatedHistory = [...history, userMsg];

      // Add user message to UI and state
      setMessages((prev) => [...prev, userMsg]);
      setHistory(updatedHistory);

      const aiResponse = await sendToGpt(updatedHistory);

      const aiMsg = {
        sender: "assistant",
        content: aiResponse,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setHistory((prev) => [...prev, aiMsg]);

      //  setAIResponse(true);
      await speakText(aiResponse);
    } catch (err: any) {
      console.log("Stop recording error:", err.message);
      setLoading(false);
      Alert.alert("Error", err.message);
    }
  };

  /* -------------------- SPEECH TO TEXT -------------------- */
  const speechToText = async (uri: string) => {
    try {
      /* 1️⃣ Upload audio (CORRECT WAY FOR EXPO) */
      const audioRes = await fetch(uri);
      const arrayBuffer = await audioRes.arrayBuffer();

      // const AAI_KEY = process.env.ASSEMBLYAI_KEY;
      console.log("AAI_KEY:", AAI_KEY);
      const uploadRes = await axios.post(
        "https://api.assemblyai.com/v2/upload",
        arrayBuffer,
        {
          headers: {
            authorization: AAI_KEY,
            "content-type": "application/octet-stream",
          },
        }
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
        }
      );

      const transcriptId = transcriptRes.data.id;

      /* 3️⃣ Poll result */
      while (true) {
        const res = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          { headers: { authorization: AAI_KEY } }
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

  const sendToGpt = async (updatedHistory) => {
    setLoading(true);
    const formattedMessages = updatedHistory.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    const APIKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

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
        }
      );

      const aiText = response.data?.output?.[0]?.content?.[0]?.text ?? "";

      setLoading(false);
      setText(aiText);
      setAIResponse(true);
      return aiText;
    } catch (err) {
      console.log("GPT API Error:", err.response?.data || err);
      throw err;
    }
  };

  const speakText = async (text: string) => {
    setAISpeaking(true);
    const options = {
      voice: "com.apple.ttsbundle.Samantha-compact",
      language: "en-US",
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
          latestMessage.sender,
          latestMessage.content,
          timestamp,
          sessionId || sessionIdFromHistory,
        ]
      );

      // console.log("💾 Message inserted after timeout:", latestMessage.content);
    }, 600); // 2 seconds delay

    return () => clearTimeout(timeout); // cleanup on re-render
  }, [messages]);
  /* -------------------- UI -------------------- */
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity
          onPress={async () => {
            router.back();
            cancelRecording();
            stopSpeaking();
          }}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text className="text-lg">Voice Chat Session</Text>
        <Ionicons name="menu" size={24} />
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
                        <Ionicons name="mic" size={30} color="black" />
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 20,
                            color: "black",
                          }}
                        >
                          Ask Again...
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
                        borderColor: "#2b3356",
                      }}
                      // className="bg-gray-300"
                    >
                      <Ionicons name="mic" size={80} color="#2b3356" />
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
            // bottom: verticalScale(80),
            width: scale(320),
            bottom: isRecording ? verticalScale(80) : verticalScale(140),
          }}
          className=""
        >
          <ScrollView
            className="bg-gray-200 rounded-xl max-h-60"
            contentContainerStyle={{ padding: 16 }}
          >
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              {loading
                ? text
                : isRecording
                  ? text || "Press mic to stop recording!"
                  : text || "Press mic and speak"}
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
              onPress={() => sendToGpt(messages)}
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
