import { useApiClient, userApi } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCurrentUser } from "./useCurrentUser";
import { Alert } from "react-native";

export const useProfile = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    bio: "",
    location: "",
    // username:""
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: any) => userApi.updateProfile(api, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update profile",
      );
    },
  });

  const openEditModal = () => {
    if (currentUser) {
      setFormData({
        firstname: currentUser.firstname || "",
        lastname: currentUser.lastname || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        // username:currentUser.username || ""
      });
    }
    setIsEditModalVisible(true);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    isEditModalVisible,
    formData,
    openEditModal,
    closeEditModal: () => setIsEditModalVisible(false),
    saveProfile: () => updateProfileMutation.mutate(formData),
    updateFormField,
    isUpdating: updateProfileMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  };
};
