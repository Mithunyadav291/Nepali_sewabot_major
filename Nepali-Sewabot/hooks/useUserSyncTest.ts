import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useAuthStore } from "@/utils/authStore";
// import { useAuthStore } from "./authStore";

export const useUserSyncTest = () => {
  const { syncUser, fetchUserProfile } = useAuthStore();
  const { user: clerkUser, isLoaded } = useUser();
  const hasSynced = useRef(false); // prevent multiple syncs

  useEffect(() => {
    if (!isLoaded || !clerkUser) return;
    if (hasSynced.current) return;

    hasSynced.current = true;

    const payload = {
      clerkId: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || "",
      fullName: clerkUser.fullName || "",
      firstname: clerkUser.firstName || "",
      lastname: clerkUser.lastName || "",
      profilePicture: clerkUser.imageUrl || "",
    //   platform: Platform.OS,
      // optional: deviceName, appVersion
    };
   

    // Sync user to backend
    syncUser(payload);

    // Fetch latest user profile from backend
    // fetchUserProfile();
  }, [isLoaded, clerkUser]);
};
