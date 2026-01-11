import { create } from "zustand";
import axiosInstance from "./apiBaseUrl";

type SyncPayload = {
  clerkId: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  provider?: string;
  platform?: string;
  deviceName?: string;
  appVersion?: string;
};
type UpdateProfilePayload = {
  firstname?: string;
  lastname?: string;
  bio?: string;
  location?: string;
  username?: string;
};

type BackendUser = {
  id: string;
  clerkId: string;
  email: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  profilePicture?: string;
};

type AuthState = {
  user: BackendUser | null;
  loading: boolean;
  error: string | null;

  syncUser: (payload: SyncPayload) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  // Sync user to backend (login or update)
  syncUser: async (payload) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.post("/user/sync", payload, {
        withCredentials: true,
      });

      set({ user: res.data.user });
      console.log("user sync successfully")
    } catch (err: any) {
      set({ error: err.message || "User sync failed" });
      console.log("User sync failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Fetch current user profile from backend
  fetchUserProfile: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get("/user/me", {
        withCredentials: true,
      });

      set({ user: res.data.user });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch user profile" });
      console.log("Fetch user failed:", err);
    } finally {
      set({ loading: false });
    }
  },

   updateProfile: async (payload) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.put("/user/update", payload, {
        withCredentials: true,
      });

      // ✅ Update local user instantly
      set({ user: res.data.user });
      console.log(res.data.message)
    } catch (err: any) {
      set({
        error:
          err.response?.data?.error || "Failed to update profile",
      });
      throw err; // allow UI to catch error
    } finally {
      set({ loading: false });
    }
  },
  // Clear user state (logout)
  clearUser: () => set({ user: null, error: null }),
}));
