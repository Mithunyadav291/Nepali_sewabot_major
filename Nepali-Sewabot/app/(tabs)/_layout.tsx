// import { useTheme } from "@/context/ThemeContext";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { useUserSync } from "@/hooks/useUserSync";
// import { useUserSyncTest } from "@/hooks/useUserSyncTest";
// import { initializeDB } from "@/utils/dbInit";
// import { useAuth } from "@clerk/clerk-expo";
// import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
// import { Redirect, Stack, Tabs } from "expo-router";
// import React, { useEffect } from "react";
// import { Text, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Drawer } from "expo-router/drawer";
// const TabLayout = () => {
//   const { currentUser } = useCurrentUser();

//   useUserSync();

//   useEffect(() => {
//     if (currentUser?._id) {
//       initializeDB(currentUser?._id); // 🧠 unique DB per user
//     }
//   }, [currentUser?._id]);

//   const insets = useSafeAreaInsets();
//   const { theme, toggleTheme } = useTheme();
//   const isDark = theme === "dark";

//   // const colors = {
//   //   tabBackground: isDark ? "#000" : "#fff",
//   //   tabBorder: isDark ? "#333" : "#E1E8ED",
//   //   active: "#1DA1F2",
//   //   inactive: isDark ? "#AAB8C2" : "#657786",
//   //   icon: isDark ? "#fff" : "#000",
//   //   headerBg: isDark ? "#000" : "#fff",
//   //   headerText: isDark ? "#fff" : "#000",
//   // };

//   const { isSignedIn } = useAuth();
//   if (!isSignedIn) {
//     return <Redirect href={"/(auth)"} />;
//   }
//   return (
//     // <Tabs
//     //   screenOptions={{
//     //     tabBarActiveTintColor: "#1DA1F2",
//     //     tabBarInactiveTintColor: "#657786",
//     //     headerShown: false,
//     //     tabBarStyle: {
//     //       backgroundColor: "#fff",
//     //       borderTopWidth: 1,
//     //       borderTopColor: "#E1E8ED",
//     //       height: 50 + insets.bottom,
//     //     },
//     //   }}
//     // >
//     //   <Tabs.Screen
//     //     name="index"
//     //     options={{
//     //       title: "Chat With AI",
//     //       headerTitleAlign: "center",
//     //       headerShown: false,

//     //       tabBarLabel: "",
//     //       tabBarIcon: ({ color, size }) => (
//     //         <Ionicons name="chatbox" size={size} color={color} />
//     //       ),
//     //     }}
//     //   />
//     //   <Tabs.Screen
//     //     name="history"
//     //     options={{
//     //       title: "History ",
//     //       tabBarLabel: "",
//     //       tabBarIcon: ({ color, size }) => (
//     //         // <Feather name="search" size={size} color={color} />
//     //         <FontAwesome5 name="history" size={size} color={color} />
//     //       ),
//     //     }}
//     //   />

//     //   <Tabs.Screen
//     //     name="profile"
//     //     options={{
//     //       title: "Profile",
//     //       tabBarLabel: "",

//     //       tabBarIcon: ({ color, size }) => (
//     //         <Feather name="user" size={size} color={color} />
//     //       ),
//     //     }}
//     //   />
//     // </Tabs>

//     <Drawer screenOptions={{ headerShown: false }}>
//       <Drawer.Screen name="index" options={{ title: "Home" }} />
//       <Drawer.Screen name="profile" />
//       <Drawer.Screen name="history" />
//     </Drawer>
//   );
// };

// export default TabLayout;

import { useTheme } from "@/context/ThemeContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserSync } from "@/hooks/useUserSync";
import { initializeDB } from "@/utils/dbInit";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";

const Layout = () => {
  const { currentUser } = useCurrentUser();
  const { isSignedIn } = useAuth();

  useUserSync();

  useEffect(() => {
    if (currentUser?._id) {
      initializeDB(currentUser._id);
    }
  }, [currentUser?._id]);

  if (!isSignedIn) {
    return <Redirect href={"/(auth)"} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="history" />
      <Stack.Screen name="profile" />
    </Stack>
  );
};

export default Layout;
