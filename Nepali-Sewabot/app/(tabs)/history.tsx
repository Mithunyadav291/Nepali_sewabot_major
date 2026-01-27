import { Entypo, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "expo-router";

const db = SQLite.openDatabaseSync("chat.db");

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const History = () => {
  const { currentUser } = useCurrentUser();

  const tableName = `messages_${currentUser?._id}`;

  const [sessions, setSessions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await load(); // re-fetch user
    } catch (error) {
      console.log("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const load = async () => {
    try {
      const rows = await db.getAllAsync(
        `SELECT * FROM ${tableName} ORDER BY id ASC;`,
      );
      const sessionsMap = new Map();

      rows.forEach((msg) => {
        if (!sessionsMap.has(msg.session_id)) {
          sessionsMap.set(msg.session_id, []);
        }
        sessionsMap.get(msg.session_id).push(msg);
      });

      const sessionPreviews = Array.from(sessionsMap.entries())
        .map(([sessionId, msgs]) => {
          const firstUserMsg = msgs.find((m) => m.sender === "user") || msgs[0];
          return {
            sessionId,
            id: firstUserMsg.id,
            preview: firstUserMsg.content,
            date: firstUserMsg.timestamp,
            messages: msgs,
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setSessions(sessionPreviews);
      // console.log({ sessionPreviews });
    } catch (error) {
      console.error("❌ Failed to load sessions by session_id", error);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await db.runAsync(`DELETE FROM ${tableName} WHERE session_id = ?;`, [
        sessionId,
      ]);
      // console.log(`✅ Deleted session ${sessionId}`);
      load(); // Refresh list
    } catch (error) {
      console.error("❌ Failed to delete session", error);
    }
  };

  const handleDeleteAllSessions = () => {
    Alert.alert(
      "Delete All History",
      "Are you sure you want to delete all chat sessions?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await db.runAsync(`DELETE FROM ${tableName};`);
              load(); // Refresh UI
            } catch (error) {
              console.error("❌ Failed to delete all sessions", error);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const confirmDelete = (sessionId) => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteSession(sessionId),
        },
      ],
      { cancelable: true },
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 ">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          Chat History
        </Text>

        {sessions.length > 0 && (
          <TouchableOpacity
            onPress={handleDeleteAllSessions}
            className="flex flex-row items-center gap-1"
          >
            <Entypo name="bucket" size={24} color="black" />
            <Text className="text-red-600">Clear All </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          // <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1DA1F2" // iOS spinner
            colors={["#1DA1F2"]} // Android spinner
          />
        }
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          // backgroundColor: "red",

          ...(sessions.length === 0 && { flex: 1, justifyContent: "center" }),
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(chatVoiceScreen)/chat",
                params: { sessionIdFromHistory: item.sessionId },
              })
            }
            onLongPress={() => confirmDelete(item.sessionId)}
          >
            <View className="px-4 py-3  border-b border-gray-200 ">
              <Text className="text-lg font-bold ">
                Chat #{sessions.length - index}
              </Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-md font-medium" numberOfLines={1}>
                  {item.preview}
                </Text>

                <Text className="text-sm font-light ">
                  {formatDate(item.date)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-lg">No chat history found.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default History;
