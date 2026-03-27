import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  FlatList,
  RefreshControl,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSignOut } from "@/hooks/useSignOut";
import { SignedOut } from "@clerk/clerk-expo";

const { width } = Dimensions.get("window");
const db = SQLite.openDatabaseSync("chat.db");

type sidebarProps = {
  visible: boolean;
  onClose: () => void;
  startNewChat: () => void;
  comesFromHistory: (conversationId: number) => void;
  conversations: any[];
  activeConvesation: any;
  onDeleteConversation: (conversationId: number) => void;
  onSelectConversation: (conversationId: number) => void;
  loadConversations: () => void;
};

const Sidebar = ({
  visible,
  onClose,
  startNewChat,
  // comesFromHistory,
  conversations,
  activeConversation,
  onDeleteConversation,
  onSelectConversation,
  loadConversations,
}: sidebarProps) => {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const { currentUser } = useCurrentUser();

  const tableName = `messages_${currentUser?._id}`;

  const [sessions, setSessions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { handleSignOut } = useSignOut();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // useEffect(() => {
  //   load();
  // }, []);

  // const load = async () => {
  //   try {
  //     const rows = await db.getAllAsync(
  //       `SELECT * FROM ${tableName} ORDER BY id ASC;`,
  //     );
  //     const sessionsMap = new Map();

  //     rows.forEach((msg) => {
  //       if (!sessionsMap.has(msg.session_id)) {
  //         sessionsMap.set(msg.session_id, []);
  //       }
  //       sessionsMap.get(msg.session_id).push(msg);
  //     });

  //     const sessionPreviews = Array.from(sessionsMap.entries())
  //       .map(([sessionId, msgs]) => {
  //         const firstUserMsg = msgs.find((m) => m.sender === "user") || msgs[0];
  //         return {
  //           sessionId,
  //           id: firstUserMsg.id,
  //           preview: firstUserMsg.content,
  //           date: firstUserMsg.timestamp,
  //           messages: msgs,
  //         };
  //       })
  //       .sort((a, b) => new Date(b.date) - new Date(a.date));

  //     setSessions(sessionPreviews);
  //     // console.log({ sessionPreviews });
  //   } catch (error) {
  //     console.error("❌ Failed to load sessions by session_id", error);
  //   }
  // };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadConversations(); // re-fetch user
    } catch (error) {
      console.log("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // const handleDeleteSession = async (sessionId) => {
  //   try {
  //     await db.runAsync(`DELETE FROM ${tableName} WHERE session_id = ?;`, [
  //       sessionId,
  //     ]);
  //     // console.log(`✅ Deleted session ${sessionId}`);
  //     load(); // Refresh list
  //   } catch (error) {
  //     console.error("❌ Failed to delete session", error);
  //   }
  // };

  // const handleDeleteAllSessions = () => {
  //   Alert.alert(
  //     "Delete All History",
  //     "Are you sure you want to delete all chat sessions?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Delete All",
  //         style: "destructive",
  //         onPress: async () => {
  //           try {
  //             await db.runAsync(`DELETE FROM ${tableName};`);
  //             load(); // Refresh UI
  //           } catch (error) {
  //             console.error("❌ Failed to delete all sessions", error);
  //           }
  //         },
  //       },
  //     ],
  //     { cancelable: true },
  //   );
  // };

  // const confirmDelete = (sessionId) => {
  //   Alert.alert(
  //     "Delete Chat",
  //     "Are you sure you want to delete this chat session?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Delete",
  //         style: "destructive",
  //         onPress: () => handleDeleteSession(sessionId),
  //       },
  //     ],
  //     { cancelable: true },
  //   );
  // };

  if (!visible) return null;

  return (
    <SafeAreaView className="absolute w-full h-full z-50">
      {/* Overlay */}
      {visible && (
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
          activeOpacity={1}
          onPress={onClose}
        />
      )}
      {/* Sidebar */}
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
          position: "absolute",
          right: 0,
          top: insets.top,
          bottom: insets.bottom,
          width: width * 0.75,
          padding: 20,
        }}
        className="bg-slate-900 rounded-l-3xl px-4"
      >
        {/* Header */}
        <View className=" flex flex-row items-center gap-4  py-4 mb-4 border-b border-white/20 -mx-4 px-4">
          <Image
            source={{
              uri: currentUser?.profilePicture,
            }}
            className="w-12 h-12 rounded-full"
          />
          <View>
            <Text className="text-white text-xl font-bold">SevaBot</Text>
            <Text className="text-indigo-200 mt-1">
              {currentUser?.username || "User"}
            </Text>
          </View>
        </View>

        {/* New Chat */}
        <TouchableOpacity
          onPress={() => {
            startNewChat();
            onClose();
          }}
          className="flex-row items-center bg-slate-800/60 p-4 rounded-xl mb-3 border border-white/20"
        >
          <Ionicons name="add-circle-outline" size={20} color="#c7d2fe" />
          <Text className="text-indigo-100 ml-3 font-medium">
            नयाँ कुराकानी
          </Text>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity
          onPress={() => {
            // router.push("/(onboarding)");
            // onClose();
          }}
          className="flex-row items-center bg-slate-800/40 p-4 rounded-xl border border-white/20"
        >
          <Ionicons name="settings-outline" size={20} color="#c7d2fe" />
          <Text className="text-indigo-100 ml-3 font-medium">सेटिङ</Text>
        </TouchableOpacity>

        {/* Empty State */}
        <View className="mt-6 ">
          <Text className="text-indigo-300 text-md mb-4"> कुराकानीहरु :</Text>
          <FlatList
            data={conversations}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 80,
              // ...(conversations.length === 0 && {
              flex: 1,
              justifyContent: "center",
              // }),
            }}
            refreshControl={
              // <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#1DA1F2" // iOS spinner
                colors={["#1DA1F2"]} // Android spinner
              />
            }
            style={{ maxHeight: 420 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  // comesFromHistory(item.sessionId);
                  onSelectConversation(item.id);
                }}
                // onLongPress={() =>
                //   //  confirmDelete(item.sessionId)
                //   onDeleteConversation(item.id)
                // }
                className="mb-3"
              >
                <View className="bg-slate-800/50 p-3 rounded-xl border border-white/10">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-indigo-300 text-xs">
                      #{conversations?.length - index} {item?.title}
                    </Text>
                    <Text className="text-indigo-400 text-[10px]">
                      {new Date(item.updated_at).toLocaleDateString("ne-NP")}
                    </Text>
                  </View>

                  <View className="flex flex-row justify-between items-center ">
                    <Text
                      numberOfLines={2}
                      className="text-white text-sm w-5/6"
                    >
                      {item.last_message?.content || "कुनै सन्देश छैन"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => onDeleteConversation(item.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="#fca5a5"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="items-center">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={28}
                  color="#818cf8"
                />
                <Text className="text-indigo-300 mt-2 text-sm">
                  कुनै कुराकानी छैन
                </Text>
              </View>
            }
          />
        </View>

        {/* Logout bottom */}
        <View className="absolute bottom-6 left-4 right-4">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center bg-red-500/20 p-4 rounded-xl"
          >
            <Ionicons name="log-out-outline" size={20} color="#fca5a5" />
            <Text className="text-red-300 ml-2 font-medium">लगआउट</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Sidebar;
