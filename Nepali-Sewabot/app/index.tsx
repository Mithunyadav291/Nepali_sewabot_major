import { useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const { isSignedIn } = useAuth();

  useEffect(() => {
    const init = async () => {
      const onboarded = await AsyncStorage.getItem("onboarding");
      if (onboarded) {
        setHasOnboarded(true);
      }
      setIsLoading(false);
    };

    init();
  }, []);

  if (isLoading) return null;

  if (!hasOnboarded) {
    return <Redirect href="/(onboarding)" />;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)" />;
  }
};

export default Index;
