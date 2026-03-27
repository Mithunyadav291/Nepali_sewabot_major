// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
//   Image,
//   StatusBar,
// } from "react-native";
// import { router, useRouter } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const { width } = Dimensions.get("window");

// const slides = [
//   {
//     id: 1,
//     title: "👋नेपाली SewaBot मा स्वागत छ। ",
//     subtitle: "सरकारी सेवाहरूको लागि तपाईंको स्मार्ट एआई सहायक 🇳🇵",
//     image: require("@/assets/images/onboarding1.png"),
//   },
//   {
//     id: 2,
//     title: "🎤 कुरा गर्नुहोस् वा ✍️ टाइप गर्नुहोस् — तपाईंको तरिका",
//     subtitle:
//       "नेपाली 🇳🇵 र अंग्रेजी 🇺🇸 दुवैलाई समर्थन गर्दछ — आवाज वा पाठ द्वारा",
//     image: require("@/assets/images/onboarding2.png"),
//   },
//   {
//     id: 3,
//     title: "📄 तत्काल जानकारी, जुनसुकै बेला",
//     subtitle: "राहदानी, नागरिकता, सामाजिक लाभ र थप कुराहरूको जवाफ पाउनुहोस्",
//     image: require("@/assets/images/onboarding3.png"),
//   },
// ];

// export default function Onboarding() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const scrollRef = useRef(null);
//   const router = useRouter();

//   const handleNext = () => {
//     if (currentSlide < slides.length - 1) {
//       scrollRef.current?.scrollToOffset({
//         offset: width * (currentSlide + 1),
//         animated: true,
//       });
//     } else {
//       finishOnboarding();
//     }
//   };

//   const skipOnboarding = () => finishOnboarding();

//   const finishOnboarding = async () => {
//     await AsyncStorage.setItem("onboarding", "true");
//     router.replace("/(auth)");
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar barStyle="light-content" />

//       <FlatList
//         data={slides}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         ref={scrollRef}
//         keyExtractor={(item) => item.id.toString()}
//         onScroll={(event) => {
//           const slideIndex = Math.round(
//             event.nativeEvent.contentOffset.x / width,
//           );
//           setCurrentSlide(slideIndex);
//         }}
//         scrollEventThrottle={16}
//         renderItem={({ item }) => (
//           <View style={{ width }} className="items-center justify-center p-5 ">
//             <Image
//               source={item.image}
//               className="w-4/5 h-[250px] mb-8 "
//               resizeMode="contain"
//             />

//             <Text className="text-2xl font-bold text-gray-800 text-center">
//               {item.title}
//             </Text>

//             <Text className="text-lg font-semibold text-gray-400 text-center mt-1">
//               {item.subtitle}
//             </Text>

//             {/* Pagination dots */}
//             <View className="absolute bottom-[110px] flex-row justify-center items-center">
//               {slides.map((_, index) => (
//                 <View
//                   key={index}
//                   className={`mx-1 rounded-full ${
//                     currentSlide === index
//                       ? "w-[10px] h-[10px] bg-gray-800"
//                       : "w-[8px] h-[8px] bg-gray-400"
//                   }`}
//                 />
//               ))}
//             </View>

//             {/* Bottom Buttons */}
//             <View className="absolute bottom-8 w-full flex-row justify-between items-center px-6 ">
//               {currentSlide < slides.length - 1 ? (
//                 <TouchableOpacity onPress={skipOnboarding}>
//                   <Text className="text-gray-700 text-lg">छोड्नुहोस्</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <View />
//               )}

//               <TouchableOpacity
//                 onPress={handleNext}
//                 className="bg-gray-500 px-6 py-3 rounded-full"
//               >
//                 <Text className="text-white font-bold">
//                   {currentSlide === slides.length - 1 ? "सुरु गरौ " : "अर्को"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  StatusBar,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "👋 नेपाली SewaBot मा स्वागत छ",
    subtitle: "सरकारी सेवाहरूको लागि तपाईंको स्मार्ट एआई साथी 🇳🇵",
    image: require("@/assets/images/onboarding1.png"),
  },
  {
    id: 2,
    title: "🎤 बोल्नुहोस् वा ✍️ लेख्नुहोस्",
    subtitle: "नेपाली 🇳🇵 र अंग्रेजी 🇺🇸 — दुबैमा सजिलो प्रयोग",
    image: require("@/assets/images/onboarding2.png"),
  },
  {
    id: 3,
    title: "📄 तुरुन्त जानकारी पाउनुहोस्",
    subtitle: "राहदानी, नागरिकता र सेवाहरूको सजिलो समाधान",
    image: require("@/assets/images/onboarding3.png"),
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      scrollRef.current?.scrollToOffset({
        offset: width * (currentSlide + 1),
        animated: true,
      });
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("onboarding", "true");
    router.replace("/(auth)");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />

      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentSlide(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="items-center justify-center px-6">
            {/* Image */}
            <View className="bg-white/10 rounded-3xl p-6 mb-10 shadow-lg">
              <Image
                source={item.image}
                className="w-[260px] h-[260px]"
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text className="text-3xl font-bold text-white text-center">
              {item.title}
            </Text>

            {/* Subtitle */}
            <Text className="text-base text-gray-300 text-center mt-3 leading-6">
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      {/* DOT INDICATOR */}
      <View className="flex-row justify-center items-center mb-28">
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={{
                width: dotWidth,
                opacity,
              }}
              className="h-2 bg-white mx-1 rounded-full"
            />
          );
        })}
      </View>

      {/* BUTTONS */}
      <View className="absolute bottom-10 w-full px-6 flex-row justify-between items-center">
        {currentSlide !== slides.length - 1 ? (
          <TouchableOpacity onPress={finishOnboarding}>
            <Text className="text-gray-300 text-lg">छोड्नुहोस्</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          onPress={handleNext}
          className="bg-white px-7 py-3 rounded-full shadow-lg"
        >
          <Text className="text-black font-bold text-lg">
            {currentSlide === slides.length - 1 ? "सुरु गरौं 🚀" : "अर्को →"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
