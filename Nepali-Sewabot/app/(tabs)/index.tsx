import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const suggestions = [
  { label: "📄 Apply Citizenship" },
  { label: "🛂 Renew Passport" },
  { label: "💰 Social Aid Info" },
  { label: "🏢 Ward Office Contact" },
];

// Generate a new session ID (timestamp-based)
const generateSessionId = () => Date.now().toString();

const HomeScreen = () => {
  const router = useRouter();

  const { currentUser: user, isLoading: loading } = useCurrentUser();

  const [input, setInput] = useState("");

  const handleSendOrVoice = () => {
    const sessionId = generateSessionId();
    if (input.trim()) {
      // Navigate to chat screen with user input
      router.push({
        pathname: "/(chatVoiceScreen)/chat",
        params: { firstMessage: input, sessionId },
      });

      setInput("");
    } else {
      // Navigate to voice screen if input is empty
      // router.push("/screens/voiceScreen");
      router.push({
        pathname: "/(chatVoiceScreen)/voice",
        params: { sessionId },
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          Nepali Sewabot
        </Text>

        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image
            source={{ uri: user?.profilePicture }}
            className="w-9 h-9 rounded-full"
          />
        </TouchableOpacity>
      </View>

      {/* KEYBOARD AVOIDING */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Title */}
          <Text className="text-2xl  font-semibold text-gray-900 dark:text-white mb-6 text-center">
            What can I help with?
          </Text>

          {/* Suggestion Chips */}
          <View className="flex-row flex-wrap justify-center gap-3 mb-10">
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="px-4 py-2 rounded-full bg-gray-600 dark:bg-gray-200"
                onPress={() => setInput(item.label)}
              >
                <Text className="dark:text-gray-900 text-white font-medium">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* INPUT FIELD */}
          <View className="w-full bg-gray-300 dark:bg-gray-800 rounded-2xl px-4 py-2 flex-row items-center">
            <TextInput
              placeholder="Ask anything..."
              placeholderTextColor="#A1A1AA"
              multiline
              numberOfLines={3}
              className="flex-1 outline-none text-gray-900 dark:text-white text-lg"
              value={input}
              onChangeText={setInput}
            />

            <TouchableOpacity onPress={handleSendOrVoice}>
              <Ionicons
                name={input.trim() ? "send" : "mic"}
                size={26}
                color="#1DA1F2"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
