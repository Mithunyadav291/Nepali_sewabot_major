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

      try {
        // 🔹 Try signup first
        const signupRes = await authAPI.signup({
          username,
          email,
          password: "defaultpassword",
        });

        console.log("Signup success:", signupRes.data);

        await AsyncStorage.setItem("token", signupRes.data.token);
        await AsyncStorage.setItem("user",  JSON.stringify(signupRes.data.user));

      } catch (signupErr: any) {
        const status = signupErr.response?.status;

        // 🔹 If user already exists → login instead
        if (status === 400 || status === 409) {
          try {
            const loginRes = await authAPI.login({
              username,
              password: "defaultpassword",
            });

            // console.log("Login success:", loginRes.data);

            await AsyncStorage.setItem("token", loginRes.data.token);
             await AsyncStorage.setItem("user",  JSON.stringify(loginRes.data.user));
            // console.log("Token", loginRes.data.token);

          } catch (loginErr: any) {
            console.error(
              "Login failed:",
              loginErr.response?.data || loginErr.message
            );
          }

          return;
        }

        // 🔹 अन्य error
        console.error(
          "Signup failed:",
          signupErr.response?.data || signupErr.message
        );
      }
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


// import { useApiClient, userApi } from "@/utils/api";
// import { authAPI } from "@/utils/api_rag";
// import { useAuth, useUser } from "@clerk/clerk-expo";
// import { useMutation } from "@tanstack/react-query";
// import { useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";



// export const useUserSync = () => {
//   const { isSignedIn } = useAuth();
//   const { user } = useUser();
//   const api = useApiClient();

//   const syncUserMutation = useMutation({
//     mutationFn: async () => {
//       let username: string | null = null;
//       let email: string | null = null;

//       // Prefer Clerk user info when signed in from clerk
//       if (user) {
//         username = user.username || `${user.firstName || ""}${user.lastName || ""}`.trim();
//         email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || null;
//       }

//       // Fallback to existing backend sync user if clerk data is unavailable
//       if (!username || !email) {
//         const response = await userApi.syncUser(api);
//         username = response.data.user.username;
//         email = response.data.user.email;
//       }

//       if (!username || !email) {
//         throw new Error("Unable to resolve username/email for auth sync");
//       }

//       const password = "defaultpassword"; // keep same default password on both signup/login

//       try {
//         // 🔹 First try login, because Clerk login usually means user already exists
//         const loginRes = await authAPI.login({ username, password });
//         await AsyncStorage.setItem("token", loginRes.data.token);
//         await AsyncStorage.setItem("user", JSON.stringify(loginRes.data.user));
//         return loginRes;
//       } catch (loginErr: any) {
//         const status = loginErr.response?.status;

//         // If login fails due to account-not-found, do signup
//         if (status === 400 || status === 401 || status === 404) {
//           const signupRes = await authAPI.signup({ username, email, password });
//           await AsyncStorage.setItem("token", signupRes.data.token);
//           await AsyncStorage.setItem("user", JSON.stringify(signupRes.data.user));
//           return signupRes;
//         }

//         // Other login errors bubble up
//         throw loginErr;
//       }
//     },

//     onSuccess: async (response: any) => {
//       console.log("Auth sync success:", response.data);
//     },

//     onError: (error: any) => {
//       console.error(
//         "User sync failed:",
//         error.response?.data || error.message
//       );
//     },
//   });

//   // 🔹 Auto trigger
//   useEffect(() => {
//     if (isSignedIn && !syncUserMutation.isPending && !syncUserMutation.data) {
//       syncUserMutation.mutate();
//     }
//   }, [isSignedIn]);

//   return {
//     isLoading: syncUserMutation.isPending,
//     error: syncUserMutation.error,
//   };
// };


