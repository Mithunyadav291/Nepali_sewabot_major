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
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 ">
        <TouchableOpacity onPress={onClose}>
          <Text className="text-blue-500 text-lg">Close</Text>
        </TouchableOpacity>
        <Text className="text-lg  font-semibold ml-28">Edit Profile</Text>
        {/* <View className="w-20" /> */}
      </View>

      <ScrollView>
        <View className="space-y-4">
          <View className="px-4 pt-3">
            <Text className="text-gray-500 text-sm mb-2">First Name</Text>
            <TextInput
              className="border outline-none border-gray-200 rounded-lg p-3 text-base"
              value={formData.firstname}
              onChangeText={(text) => updateFormField("firstname", text)}
              placeholder="Your first name"
            />
          </View>

          <View className="px-4 pt-3">
            <Text className="text-gray-500 text-sm mb-2">Last Name</Text>
            <TextInput
              className="border outline-none border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.lastname}
              onChangeText={(text) => updateFormField("lastname", text)}
              placeholder="Your last name"
            />
          </View>

          <View className="px-4 pt-3">
            <Text className="text-gray-500 text-sm mb-2">Bio</Text>
            <TextInput
              className="border outline-none border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.bio}
              onChangeText={(text) => updateFormField("bio", text)}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View className="px-4 pt-3">
            <Text className="text-gray-500 text-sm mb-2">Location</Text>
            <TextInput
              className="border outline-none border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.location}
              onChangeText={(text) => updateFormField("location", text)}
              placeholder="Where are you located?"
            />
          </View>
        </View>

        <TouchableOpacity
          // onPress={handleSave}
          disabled={isUpdating}
          className={`${isUpdating ? "opacity-50" : ""} bg-blue-600 mx-4 my-6 rounded-full py-3 items-center `}
        >
          {isUpdating ? (
            <ActivityIndicator
              color="white"
              style={{ transform: [{ scale: 1.5 }], paddingVertical: 2 }}
            />
          ) : (
            <Text className="text-white text-xl font-semibold">Save</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

export default EditProfileModal;
