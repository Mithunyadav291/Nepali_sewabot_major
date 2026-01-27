import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import { router, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "👋 Welcome to Nepali SevaBot",
    subtitle: "Your smart AI assistant 🇳🇵 for government services",
    image: require("@/assets/images/onboarding1.png"),
  },
  {
    id: 2,
    title: "🎤 Talk or ✍️ Type — Your Way",
    subtitle: "Supports both Nepali 🇳🇵 and English 🇺🇸 — by voice or text",
    image: require("@/assets/images/onboarding2.png"),
  },
  {
    id: 3,
    title: "📄 Instant Info, Anytime",
    subtitle: "Get answers on passports, citizenship, social benefits & more",
    image: require("@/assets/images/onboarding3.png"),
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);
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

  const skipOnboarding = () => finishOnboarding();

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("onboarding", "true");
    router.replace("/(auth)");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        keyExtractor={(item) => item.id.toString()}
        onScroll={(event) => {
          const slideIndex = Math.round(
            event.nativeEvent.contentOffset.x / width,
          );
          setCurrentSlide(slideIndex);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ width }} className="items-center justify-center p-5 ">
            <Image
              source={item.image}
              className="w-4/5 h-[250px] mb-8 "
              resizeMode="contain"
            />

            <Text className="text-2xl font-bold text-gray-800 text-center">
              {item.title}
            </Text>

            <Text className="text-lg font-semibold text-gray-400 text-center mt-1">
              {item.subtitle}
            </Text>

            {/* Pagination dots */}
            <View className="absolute bottom-[110px] flex-row justify-center items-center">
              {slides.map((_, index) => (
                <View
                  key={index}
                  className={`mx-1 rounded-full ${
                    currentSlide === index
                      ? "w-[10px] h-[10px] bg-gray-800"
                      : "w-[8px] h-[8px] bg-gray-400"
                  }`}
                />
              ))}
            </View>

            {/* Bottom Buttons */}
            <View className="absolute bottom-8 w-full flex-row justify-between items-center px-6 ">
              {currentSlide < slides.length - 1 ? (
                <TouchableOpacity onPress={skipOnboarding}>
                  <Text className="text-gray-700 text-lg">Skip</Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              <TouchableOpacity
                onPress={handleNext}
                className="bg-gray-500 px-6 py-3 rounded-full"
              >
                <Text className="text-white font-bold">
                  {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
