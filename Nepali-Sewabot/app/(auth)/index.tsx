// import { useSocialAuth } from "@/hooks/useSocialAuth";
// import { FontAwesome5 } from "@expo/vector-icons";
// import {
//   ActivityIndicator,
//   Image,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// // import { useSocialAuth } from "@/hooks/useSocialAuth";
// // import { useAuth } from "@clerk/clerk-expo";

// export default function Index() {
//   const { isLoading, handleSocialAuth, strategyType } = useSocialAuth();
//   // const isLoading = false;
//   return (
//     <View className="flex-1 bg-white">
//       <View className="flex-1 px-8 justify-between ">
//         <View className="flex-1 justify-center gap-2">
//           {/* image */}
//           <View className="flex items-center ">
//             <Image
//               source={require("../../assets/images/heroImg.png")}
//               resizeMode="contain"
//               className="size-96"
//               //       style={{
//               //   width: 280,
//               //   height: 280,
//               // }}
//             />
//           </View>

//           {/* buttons */}
//           <View className="gap-2 flex-col -mt-10 ">
//             <TouchableOpacity
//               className="flex-row items-center justify-center bg-white border
//             border-gray-300 rounded-full py-3 px-6"
//               onPress={() => handleSocialAuth("oauth_google")}
//               disabled={isLoading}
//               style={{
//                 shadowColor: "#000",
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 2,
//                 elevation: 2,
//               }}
//             >
//               {isLoading && strategyType === "oauth_google" ? (
//                 <ActivityIndicator size={30} color="#000" />
//               ) : (
//                 <View className="flex-row items-center justify-center">
//                   <Image
//                     source={require("../../assets/images/google.png")}
//                     className="size-10 mr-3"
//                     resizeMode="contain"
//                   />

//                   <Text className="text-black font-medium text-base">
//                     continue with Google
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//             {/* <TouchableOpacity
//               className="flex-row items-center justify-center bg-white border
//             border-gray-300 rounded-full py-3 px-6"
//               onPress={() => handleSocialAuth("oauth_facebook")}
//               disabled={isLoading}
//               style={{
//                 shadowColor: "#000",
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 2,
//                 elevation: 2,
//               }}
//             >
//               {isLoading ? (
//                 <ActivityIndicator size={30} color="#000" />
//               ) : (
//                 <View className="flex-row items-center justify-center">
//                   <FontAwesome5
//                     name="facebook"
//                     size={26}
//                     color="#1877F2"
//                     className="mr-3"
//                   />
//                   <Text className="text-black font-medium text-base">
//                     continue with Facebook
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity> */}
//             <TouchableOpacity
//               className="flex-row items-center justify-center bg-white border
//             border-gray-300 rounded-full py-3 px-6"
//               onPress={() => handleSocialAuth("oauth_github")}
//               disabled={isLoading}
//               style={{
//                 shadowColor: "#000",
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 2,
//                 elevation: 2,
//               }}
//             >
//               {isLoading && strategyType === "oauth_github" ? (
//                 <ActivityIndicator size={30} color="#000" />
//               ) : (
//                 <View className="flex-row items-center justify-center">
//                   <FontAwesome5
//                     name="github"
//                     size={26}
//                     // color="#1877F2"
//                     className="mr-3"
//                   />
//                   <Text className="text-black font-medium text-base">
//                     continue with GitHub
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="flex-row items-center justify-center bg-white border
//             border-gray-300 rounded-full py-3 px-6"
//               onPress={() => handleSocialAuth("oauth_apple")}
//               disabled={isLoading}
//               style={{
//                 shadowColor: "#000",
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 2,
//                 elevation: 2,
//               }}
//             >
//               {isLoading && strategyType === "oauth_apple" ? (
//                 <ActivityIndicator size={30} color="#000" />
//               ) : (
//                 <View className="flex-row items-center justify-center">
//                   <Image
//                     source={require("../../assets/images/apple.png")}
//                     className="size-8 mr-3"
//                     resizeMode="contain"
//                   />
//                   <Text className="text-black font-medium text-base">
//                     continue with Apple
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* Terms and privacy */}
//           <View>
//             <Text className="text-center text-gray-500 text-xs leading-4 px-2">
//               By signing up, you agree to our
//               <Text className="text-blue-500"> Terms</Text>
//               {", "}
//               <Text className="text-blue-500">Privacy Policy</Text>
//               {", and "}
//               <Text className="text-blue-500">Cookie Use</Text>
//             </Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

import { useSocialAuth } from "@/hooks/useSocialAuth";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { isLoading, handleSocialAuth, strategyType } = useSocialAuth();

  return (
    <View className="flex-1 bg-slate-900">
      <View className="flex-1 px-6 justify-between py-10">
        {/* TOP SECTION */}
        <View className="items-center mt-6">
          <Image
            source={require("../../assets/images/heroImg.png")}
            className="w-72 h-72"
            resizeMode="contain"
          />

          <Text className="text-white text-3xl font-bold text-center mt-2">
            👋 स्वागत छ
          </Text>

          <Text className="text-gray-300 text-center mt-2 text-base">
            नेपाली SewaBot प्रयोग गरेर सरकारी सेवाहरू सजिलै पाउनुहोस् 🇳🇵
          </Text>

          <Text className="text-green-400 text-sm mt-2">🔐 सुरक्षित लगइन</Text>
        </View>

        {/* BUTTONS */}
        <View className="gap-3">
          {/* GOOGLE */}
          <TouchableOpacity
            onPress={() => handleSocialAuth("oauth_google")}
            disabled={isLoading}
            className="flex-row items-center justify-center bg-white rounded-full py-3"
          >
            {isLoading && strategyType === "oauth_google" ? (
              <ActivityIndicator size={22} color="#000" />
            ) : (
              <>
                <Image
                  source={require("../../assets/images/google.png")}
                  className="w-6 h-6 mr-3"
                />
                <Text className="text-black font-semibold">
                  Google मार्फत जारी गर्नुहोस्
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* GITHUB */}
          <TouchableOpacity
            onPress={() => handleSocialAuth("oauth_github")}
            disabled={isLoading}
            className="flex-row items-center justify-center bg-black border border-gray-700 rounded-full py-3"
          >
            {isLoading && strategyType === "oauth_github" ? (
              <ActivityIndicator size={22} color="#fff" />
            ) : (
              <>
                <FontAwesome5 name="github" size={20} color="#fff" />
                <Text className="text-white font-semibold ml-3">
                  GitHub मार्फत जारी गर्नुहोस्
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* APPLE */}
          <TouchableOpacity
            onPress={() => handleSocialAuth("oauth_apple")}
            disabled={isLoading}
            className="flex-row items-center justify-center bg-white rounded-full py-3"
          >
            {isLoading && strategyType === "oauth_apple" ? (
              <ActivityIndicator size={22} color="#000" />
            ) : (
              <>
                <Image
                  source={require("../../assets/images/apple.png")}
                  className="w-5 h-5 mr-3"
                />
                <Text className="text-black font-semibold">
                  Apple मार्फत जारी गर्नुहोस्
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* EXTRA FEATURES */}
        <View className="mt-6">
          {/* WHY USE */}
          <View className="bg-white/10 rounded-2xl p-4 mb-4">
            <Text className="text-white font-semibold mb-2">
              🚀 किन SewaBot प्रयोग गर्ने?
            </Text>
            <Text className="text-gray-300 text-sm">
              • सरकारी सेवाको जानकारी तुरुन्त पाउनुहोस्{"\n"}• नेपाली र अंग्रेजी
              दुबैमा सहयोग{"\n"}• २४/७ उपलब्ध एआई सहायक
            </Text>
          </View>

          {/* TERMS */}
          <Text className="text-center text-gray-400 text-xs leading-5 px-2">
            साइन अप गर्दा, तपाईं हाम्रो
            <Text className="text-blue-400"> सर्तहरू</Text>,{" "}
            <Text className="text-blue-400">गोपनीयता नीति</Text> र{" "}
            <Text className="text-blue-400">कुकी प्रयोग</Text> मा सहमत
            हुनुहुन्छ।
          </Text>
        </View>
      </View>
    </View>
  );
}
