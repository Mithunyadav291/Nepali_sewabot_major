import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
  ScrollView,
  RefreshControl,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/hooks/useUpdateProfile";
import EditProfileModal from "@/components/EditProfileModal";
import { useSignOut } from "@/hooks/useSignOut";
import Constants from "expo-constants";

const ProfileScreen = () => {
  const { theme, toggleTheme } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { currentUser: user, isLoading, refetch } = useCurrentUser();
  const { handleSignOut } = useSignOut();

  const {
    isEditModalVisible,
    openEditModal,
    closeEditModal,
    formData,
    saveProfile,
    isUpdating,
    updateFormField,
  } = useProfile();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const openURL = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else Alert.alert("त्रुटि", "लिङ्क खोल्न सकिएन।");
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator
          size="large"
          color={theme === "dark" ? "#60a5fa" : "#2563EB"}
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Card */}
        <View className="items-center px-4 mt-4">
          <View className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 items-center">
            {/* Avatar */}
            <View className="relative">
              <Image
                source={{
                  uri:
                    user?.profilePicture || "https://i.pravatar.cc/150?img=12",
                }}
                className="w-24 h-24 rounded-full"
              />

              <TouchableOpacity
                onPress={openEditModal}
                className="absolute bottom-0 right-0 bg-slate-800 dark:bg-slate-600 p-2 rounded-full"
              >
                <Feather name="edit-2" size={14} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Name */}
            <Text className="text-xl font-bold mt-3 text-black dark:text-white">
              {user?.firstname} {user?.lastname}
            </Text>

            {/* Username */}
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              @{user?.username}
            </Text>

            {/* Bio */}
            {user?.bio && (
              <Text className="text-center text-gray-600 dark:text-gray-300 mt-2 text-sm px-4">
                {user.bio}
              </Text>
            )}

            {/* Location */}
            {user?.location && (
              <View className="flex-row items-center mt-2">
                <Feather name="map-pin" size={14} color="gray" />
                <Text className="ml-1 text-gray-600 dark:text-gray-300 text-sm">
                  {user.location}
                </Text>
              </View>
            )}

            {/* Edit Button */}
            <TouchableOpacity
              onPress={openEditModal}
              className="mt-4 border border-slate-800 dark:border-slate-600 px-5 py-2 rounded-full"
            >
              <Text className="text-slate-800 dark:text-slate-200 font-semibold">
                प्रोफाइल सम्पादन गर्नुहोस्
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6 px-4">
          {/* Dark Mode */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center">
              <Ionicons name="moon-outline" size={22} color="gray" />
              <Text className="ml-3 text-base text-black dark:text-white">
                अँध्यारो मोड
              </Text>
            </View>
            <Switch value={theme === "dark"} onValueChange={toggleTheme} />
          </View>

          {/* About */}
          <TouchableOpacity
            onPress={() => setShowSettingsMenu(true)}
            className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700"
          >
            <View className="flex-row items-center">
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="gray"
              />
              <Text className="ml-3 text-base text-black dark:text-white">
                नेपाली सेवा बोटको बारेमा
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            onPress={() => handleSignOut()}
            className="flex-row items-center justify-center py-4 bg-slate-800 dark:bg-slate-600 rounded-xl mt-4 "
          >
            <Ionicons name="log-out-outline" size={22} color="white" />
            <Text className="ml-3 text-base text-white font-semibold">
              लगआउट गर्नुहोस्
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center mt-8 mb-4">
          <Text className="text-gray-400 dark:text-gray-500 text-xs">
            सामेल हुनुभयो: {new Date(user?.createdAt).toDateString()}
          </Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={closeEditModal}
        formData={formData}
        saveProfile={saveProfile}
        updateFormField={updateFormField}
        isUpdating={isUpdating}
      />

      {/* Floating Settings Menu */}
      <Modal
        // animationType="fade"
        transparent
        visible={showSettingsMenu}
        animationType="slide" //slide, fade,none
        presentationStyle="overFullScreen" //formSheet, fullScreen, overFullScreen, pageSheet
        onRequestClose={() => setShowSettingsMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSettingsMenu(false)}>
          <View style={styles.settingOverlayFull}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  position: "absolute",
                  bottom: 150,
                  right: 25,
                  left: 25,
                  backgroundColor: theme === "dark" ? "#374151" : "white",
                  borderRadius: 8,
                  padding: 10,
                  zIndex: 20,
                  elevation: 5,
                }}
              >
                {/* Notifications */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: theme === "dark" ? "#6b7280" : "#555",
                  }}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={18}
                    color="gray"
                  />
                  <Text
                    style={{
                      color: theme === "dark" ? "white" : "black",
                      fontSize: 14,
                      marginLeft: 8,
                    }}
                  >
                    सूचनाहरू
                  </Text>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    // thumbColor="#fff"
                    // trackColor={{ false: "#777", true: "#4cd137" }}
                    style={{ marginLeft: "auto" }}
                  />
                </View>

                {/* Privacy Policy */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: theme === "dark" ? "#6b7280" : "#555",
                  }}
                  onPress={() => openURL("https://yourdomain.com/privacy")}
                >
                  <Ionicons name="document-outline" size={18} color="gray" />
                  <Text
                    style={{
                      color: theme === "dark" ? "white" : "black",
                      fontSize: 14,
                      marginLeft: 8,
                    }}
                  >
                    गोपनीयता नीति
                  </Text>
                </TouchableOpacity>

                {/* Terms of Service */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: theme === "dark" ? "#6b7280" : "#555",
                  }}
                  onPress={() => openURL("https://yourdomain.com/terms")}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="gray"
                  />
                  <Text
                    style={{
                      color: theme === "dark" ? "white" : "black",
                      fontSize: 14,
                      marginLeft: 8,
                    }}
                  >
                    सेवाका सर्तहरू
                  </Text>
                </TouchableOpacity>

                {/* Feedback */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: theme === "dark" ? "#6b7280" : "#555",
                  }}
                  onPress={() => openURL("mailto:support@yourdomain.com")}
                >
                  <Ionicons
                    name="chatbox-ellipses-outline"
                    size={18}
                    color="gray"
                  />
                  <Text
                    style={{
                      color: theme === "dark" ? "white" : "black",
                      fontSize: 14,
                      marginLeft: 8,
                    }}
                  >
                    प्रतिक्रिया पठाउनुहोस्
                  </Text>
                </TouchableOpacity>

                {/* Rate App */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: theme === "dark" ? "#6b7280" : "#555",
                  }}
                  onPress={() =>
                    openURL(
                      "https://play.google.com/store/apps/details?id=yourapp",
                    )
                  }
                >
                  <Ionicons name="star-outline" size={18} color="gray" />
                  <Text
                    style={{
                      color: theme === "dark" ? "white" : "black",
                      fontSize: 14,
                      marginLeft: 8,
                    }}
                  >
                    यो एप मूल्यांकन गर्नुहोस्
                  </Text>
                </TouchableOpacity>

                {/* App Version */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: theme === "dark" ? "#6b7280" : "#555",
                  }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color="gray"
                  />
                  <Text
                    style={{
                      color: theme === "dark" ? "white" : "black",
                      fontSize: 14,
                      marginLeft: 8,
                    }}
                  >
                    संस्करण
                  </Text>
                  <Text
                    style={{
                      color: theme === "dark" ? "white" : "black",
                      fontSize: 14,
                      marginLeft: "auto",
                    }}
                  >
                    {Constants.expoConfig?.version || "1.0.0"}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Floating Settings Menu */}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  settingOverlayFull: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // keep it transparent so only menu is visible
    // justifyContent: "flex-start",
  },

  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 10,
  },
  settingText: { color: "#fff", fontSize: 16, marginLeft: 10 },

  modalTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    paddingTop: 4,
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 6,
    backgroundColor: "#34495e",
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  modalOptionText: { color: "#fff", fontSize: 16 },
});
