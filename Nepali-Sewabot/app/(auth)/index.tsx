// import { useRouter } from "expo-router";
// import React from "react";
// import { ImageBackground, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const SignUpScreen = () => {
//   const router = useRouter();
//   return (
//     <SafeAreaView className="flex-1 bg-slate-200">
//       <ImageBackground
//         source={require("../../assets/images/auth1.png")}
//         className="flex-1 "
//         resizeMode="cover"
//       >
//         <View className="flex-1 items-center justify-center ">
//           <Text>Home screen</Text>
//         </View>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// };

// export default SignUpScreen;

import { useSocialAuth } from "@/hooks/useSocialAuth";
import { Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { useSocialAuth } from "@/hooks/useSocialAuth";
// import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isLoading, handleSocialAuth, strategyType } = useSocialAuth();
  // const isLoading = false;
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-between ">
        <View className="flex-1 justify-center gap-2">
          {/* image */}
          <View className=" items-center">
            <Image
              source={require("../../assets/images/auth2.png")}
              resizeMode="contain"
              className="size-96"
            />
          </View>

          {/* buttons */}
          <View className="gap-2 flex-col">
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border 
            border-gray-300 rounded-full py-3 px-6"
              onPress={() => handleSocialAuth("oauth_google")}
              disabled={isLoading}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              {isLoading ? (
                <ActivityIndicator size={30} color="#000" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Image
                    source={require("../../assets/images/google.png")}
                    className="size-10 mr-3"
                    resizeMode="contain"
                  />

                  <Text className="text-black font-medium text-base">
                    continue with Google
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border 
            border-gray-300 rounded-full py-3 px-6"
              onPress={() => handleSocialAuth("oauth_facebook")}
              disabled={isLoading}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              {isLoading ? (
                <ActivityIndicator size={30} color="#000" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <FontAwesome5
                    name="facebook"
                    size={26}
                    color="#1877F2"
                    className="mr-3"
                  />
                  <Text className="text-black font-medium text-base">
                    continue with Facebook
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border 
            border-gray-300 rounded-full py-3 px-6"
              onPress={() => handleSocialAuth("oauth_github")}
              disabled={isLoading}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              {isLoading ? (
                <ActivityIndicator size={30} color="#000" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <FontAwesome5
                    name="github"
                    size={26}
                    // color="#1877F2"
                    className="mr-3"
                  />
                  <Text className="text-black font-medium text-base">
                    continue with GitHub
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border 
            border-gray-300 rounded-full py-3 px-6"
              onPress={() => handleSocialAuth("oauth_apple")}
              disabled={isLoading}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              {isLoading ? (
                <ActivityIndicator size={30} color="#000" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Image
                    source={require("../../assets/images/apple.png")}
                    className="size-8 mr-3"
                    resizeMode="contain"
                  />
                  <Text className="text-black font-medium text-base">
                    continue with Apple
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Terms and privacy */}
          <View>
            <Text className="text-center text-gray-500 text-xs leading-4 px-2">
              By signing up, you agree to our
              <Text className="text-blue-500"> Terms</Text>
              {", "}
              <Text className="text-blue-500">Privacy Policy</Text>
              {", and "}
              <Text className="text-blue-500">Cookie Use</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
