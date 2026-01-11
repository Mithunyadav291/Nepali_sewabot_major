// import { ClerkProvider } from "@clerk/clerk-expo";
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
// import { Stack } from "expo-router";
// import React from "react";
// import "../global.css";

// const RootLayout = () => {
//   return (
//     <ClerkProvider tokenCache={tokenCache}>
//       <Stack>
//         <Stack.Screen name="index" options={{ headerShown: true }} />
//         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       </Stack>
//     </ClerkProvider>
//   );
// };

// export default RootLayout;

import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "../context/ThemeContext.js";


const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(onboarding)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(chatVoiceScreen)"
              options={{ headerShown: false }}
            />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
