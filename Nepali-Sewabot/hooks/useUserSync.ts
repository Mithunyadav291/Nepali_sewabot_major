import { useApiClient, userApi } from "@/utils/api";
import { authAPI } from "@/utils/api_rag";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserResponse = {
  data: {
    user: {
      username: string;
      email: string;
    };
  };
};

export const useUserSync = () => {
  const { isSignedIn } = useAuth();
  const api = useApiClient();

  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),

    onSuccess: async (response: UserResponse) => {
      const { username, email } = response.data.user;

    //   try {
    //     // 🔹 Try signup first
    //     const signupRes = await authAPI.signup({
    //       username,
    //       email,
    //       password: "defaultpassword",
    //     });

    //     console.log("Signup success:", signupRes.data);

    //     await AsyncStorage.setItem("token", signupRes.data.token);

    //   } catch (signupErr: any) {
    //     const status = signupErr.response?.status;

    //     // 🔹 If user already exists → login instead
    //     if (status === 400 || status === 409) {
    //       try {
    //         const loginRes = await authAPI.login({
    //           username,
    //           password: "defaultpassword",
    //         });

    //         // console.log("Login success:", loginRes.data);

    //         await AsyncStorage.setItem("token", loginRes.data.token);
    //         // console.log("Token", loginRes.data.token);

    //       } catch (loginErr: any) {
    //         console.error(
    //           "Login failed:",
    //           loginErr.response?.data || loginErr.message
    //         );
    //       }

    //       return;
    //     }

    //     // 🔹 अन्य error
    //     console.error(
    //       "Signup failed:",
    //       signupErr.response?.data || signupErr.message
    //     );
    //   }
    // },
    console.log("success");
    },

    onError: (error: any) => {
      console.error(
        "User sync failed:",
        error.response?.data || error.message
      );
    },
  });

  // 🔹 Auto trigger
  useEffect(() => {
    if (isSignedIn && !syncUserMutation.isPending && !syncUserMutation.data) {
      syncUserMutation.mutate();
    }
  }, [isSignedIn]);

  return {
    isLoading: syncUserMutation.isPending,
    error: syncUserMutation.error,
  };
};