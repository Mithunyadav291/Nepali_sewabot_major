import { useTheme } from "@/context/ThemeContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserSyncTest } from "@/hooks/useUserSyncTest";
import { useAuthStore } from "@/utils/authStore";
import { initializeDB } from "@/utils/dbInit";
import { useAuth } from "@clerk/clerk-expo";
import { Entypo, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabLayout = () => {
  // const { currentUser, isLoading } = useCurrentUser();

  useUserSyncTest();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?._id) {
      initializeDB(user?._id); // 🧠 unique DB per user
    }
  }, [user?._id]);

  const insets = useSafeAreaInsets();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const colors = {
    tabBackground: isDark ? "#000" : "#fff",
    tabBorder: isDark ? "#333" : "#E1E8ED",
    active: "#1DA1F2",
    inactive: isDark ? "#AAB8C2" : "#657786",
    icon: isDark ? "#fff" : "#000",
    headerBg: isDark ? "#000" : "#fff",
    headerText: isDark ? "#fff" : "#000",
  };

  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return <Redirect href={"/(auth)"} />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1DA1F2",
        tabBarInactiveTintColor: "#657786",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E1E8ED",
          height: 50 + insets.bottom,
        },
      }}
    >
      {/* <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBackground,
          borderTopWidth: 1,
          borderTopColor: colors.tabBorder,
          height: 50 + insets.bottom,
        },
      }}
    > */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Chat With AI",
          headerTitleAlign: "center",
          headerShown: false,
          // headerRight: () => (
          //   <View className="mr-4">
          //     <Feather name="user" size={24} color="black" />
          //   </View>
          // ),
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => (
            // <Feather name="home" size={size} color={color} />
            // <Entypo name="chat" size={size} color={color} />
            <Ionicons name="chatbox" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History ",
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => (
            // <Feather name="search" size={size} color={color} />
            <FontAwesome5 name="history" size={size} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarLabel: "",

          tabBarIcon: ({ color, size }) => (
            <Feather name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Messages",
          tabBarLabel: "",

          tabBarIcon: ({ color, size }) => (
            <Feather name="mail" size={size} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "",

          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
