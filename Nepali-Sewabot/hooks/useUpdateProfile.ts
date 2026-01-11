import { useState } from "react";
import { Alert } from "react-native";
import { useAuthStore } from "@/utils/authStore";

export const useProfile = () => {
  const { user, loading, updateProfile } = useAuthStore();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    bio: "",
    location: "",
    // username:"",
  });

  const openEditModal = () => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        bio: user?.bio || "",
        location: user?.location || "",
      });
    }
    setIsEditModalVisible(true);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    try {
      await updateProfile(formData);
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return {
    isEditModalVisible,
    formData,
    openEditModal,
    closeEditModal: () => setIsEditModalVisible(false),
    updateFormField,
    saveProfile,
    isUpdating: loading,
  };
};
