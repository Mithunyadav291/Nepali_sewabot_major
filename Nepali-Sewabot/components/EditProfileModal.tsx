import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  formData: {
    firstname: string;
    lastname: string;
    bio: string;
    location: string;
  };
  saveProfile: () => void;
  updateFormField: (field: string, value: string) => void;
  isUpdating: boolean;
}

const EditProfileModal = ({
  isVisible,
  onClose,
  formData,
  saveProfile,
  updateFormField,
  isUpdating,
}: EditProfileModalProps) => {
  const { theme } = useTheme();
  const handleSave = () => {
    saveProfile();
    // onClose();
  };
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      {/* Modal Header */}
      <View
        className={`flex-row items-center px-4 py-3 border-b ${theme === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-100 bg-white"}`}
      >
        <TouchableOpacity onPress={onClose}>
          <Text
            className={`text-lg ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`}
          >
            बन्द गर्नुहोस्
          </Text>
        </TouchableOpacity>
        <Text
          className={`text-lg font-semibold flex-1 text-center ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          प्रोफाइल सम्पादन गर्नुहोस्
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className={theme === "dark" ? "bg-gray-900" : "bg-white"}>
        <View className="space-y-4">
          <View className="px-4 pt-3">
            <Text
              className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              पहिलो नाम
            </Text>
            <TextInput
              className={`border outline-none rounded-lg p-3 text-base ${theme === "dark" ? "border-gray-600 bg-gray-800 text-white" : "border-gray-200 bg-white text-black"}`}
              value={formData.firstname}
              onChangeText={(text) => updateFormField("firstname", text)}
              placeholder="तपाईको पहिलो नाम"
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
            />
          </View>

          <View className="px-4 pt-3">
            <Text
              className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              थर
            </Text>
            <TextInput
              className={`border outline-none rounded-lg px-3 py-3 text-base ${theme === "dark" ? "border-gray-600 bg-gray-800 text-white" : "border-gray-200 bg-white text-black"}`}
              value={formData.lastname}
              onChangeText={(text) => updateFormField("lastname", text)}
              placeholder="तपाईको थर"
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
            />
          </View>

          <View className="px-4 pt-3">
            <Text
              className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              बायो
            </Text>
            <TextInput
              className={`border outline-none rounded-lg px-3 py-3 text-base ${theme === "dark" ? "border-gray-600 bg-gray-800 text-white" : "border-gray-200 bg-white text-black"}`}
              value={formData.bio}
              onChangeText={(text) => updateFormField("bio", text)}
              placeholder="आफ्नो बारेमा बताउनुहोस्"
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View className="px-4 pt-3">
            <Text
              className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              स्थान
            </Text>
            <TextInput
              className={`border outline-none rounded-lg px-3 py-3 text-base ${theme === "dark" ? "border-gray-600 bg-gray-800 text-white" : "border-gray-200 bg-white text-black"}`}
              value={formData.location}
              onChangeText={(text) => updateFormField("location", text)}
              placeholder="तपाई कहाँ हुनुहुन्छ?"
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isUpdating}
          className={`${isUpdating ? "opacity-50" : ""} ${theme === "dark" ? "bg-blue-700" : "bg-blue-600"} mx-4 my-6 rounded-full py-3 items-center `}
        >
          {isUpdating ? (
            <ActivityIndicator
              color="white"
              style={{ transform: [{ scale: 1.5 }], paddingVertical: 2 }}
            />
          ) : (
            <Text className="text-white text-xl font-semibold">
              बचत गर्नुहोस्
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

export default EditProfileModal;
