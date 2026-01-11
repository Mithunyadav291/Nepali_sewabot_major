import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  Modal,
  TouchableWithoutFeedback,
  Linking,
  Alert,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SafeAreaView } from "react-native-safe-area-context";
import SignOutButton from "@/components/SignOutButton";
import { ActivityIndicator } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useAuthStore } from "@/utils/authStore";
import { useProfile } from "@/hooks/useUpdateProfile";
import EditProfileModal from "@/components/EditProfileModal";

const ProfileScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("en");

  const [refreshing, setRefreshing] = useState(false);

  // const { currentUser, isLoading, error, refetch } = useCurrentUser();
  const { user, loading, fetchUserProfile } = useAuthStore();
  useEffect(() => {
    fetchUserProfile();
  }, [!user]);

  const {
    isEditModalVisible,
    formData,
    openEditModal,
    closeEditModal,
    updateFormField,
    saveProfile,
    isUpdating,
  } = useProfile();

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchUserProfile(); // re-fetch user
    } catch (error) {
      console.log("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else Alert.alert("Error", "Unable to open link.");
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black " edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1DA1F2" // iOS spinner
            colors={["#1DA1F2"]} // Android spinner
          />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              {/* {currentUser.firstname} {currentUser.lastname} */}
              Profile
            </Text>
          </View>
          <SignOutButton />
        </View>

        {/* User Info */}
        <View className="items-center px-4 mt-6">
          {/* Profile Card */}
          <View className="w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-md p-6 items-center">
            {/* Avatar */}
            <View className="relative">
              <Image
                source={{ uri: user?.profilePicture }}
                className="w-28 h-28 rounded-full border-4 border-white dark:border-zinc-800"
              />

              {/* Edit badge */}
              <TouchableOpacity
                onPress={openEditModal}
                className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full"
              >
                <Feather name="edit-2" size={14} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Name */}
            <Text className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
              {user?.firstname} {user?.lastname}
            </Text>

            {/* Username */}
            <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              @{user?.username}
            </Text>

            {/* Bio */}
            {user?.bio ? (
              <Text
                className="text-center text-gray-600 dark:text-gray-300 mt-3 px-4 text-sm leading-5"
                numberOfLines={3}
              >
                {user.bio}
              </Text>
            ) : null}

            {/* Location */}
            {user?.location ? (
              <View className="flex-row items-center mt-3 px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800">
                <Feather name="map-pin" size={14} color="#6b7280" />
                <Text className="ml-1 text-gray-600 dark:text-gray-300 text-sm">
                  {user.location}
                </Text>
              </View>
            ) : null}

            {/* Divider */}
            <View className="w-full h-px bg-gray-200 dark:bg-zinc-700 my-5" />

            {/* Action Button */}
            <TouchableOpacity
              onPress={openEditModal}
              className="flex-row items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-500 w-full"
            >
              <Feather name="edit" size={16} color="#fff" />
              <Text className="text-white font-semibold text-base">
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings List */}
        <View className="mt-10 px-4 ">
          {/* Language */}
          <TouchableOpacity
            onPress={() => setShowLanguageModal(true)}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
          >
            <View className="flex-row items-center">
              <Ionicons name="language-outline" size={22} color="gray" />
              <Text className="ml-3 text-gray-800 dark:text-white text-base">
                Language
              </Text>
            </View>
            <Text className="text-gray-500 dark:text-white">
              {/* English / Nepali */}
              {language === "en" ? "English" : "नेपाली"}
            </Text>
          </TouchableOpacity>

          {/* Dark Mode */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="moon-outline" size={22} color="gray" />
              <Text className="ml-3 text-gray-800 dark:text-white text-base">
                Dark Mode
              </Text>
            </View>
            <Switch
              value={theme === "dark"}
              onValueChange={toggleTheme}
              // thumbColor="#fff"
              // trackColor={{ false: "#777", true: "#4cd137" }}
            />
          </View>

          {/* About App */}
          <TouchableOpacity
            onPress={() => setShowSettingsMenu(!showSettingsMenu)}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
          >
            <View className="flex-row items-center">
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="gray"
              />
              <Text className="ml-3 text-gray-800 dark:text-white text-base">
                About Nepali SevaBot
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        </View>

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
                <View style={styles.settingsMenu}>
                  {/* Notifications */}
                  <View style={styles.menuRow}>
                    <Ionicons
                      name="notifications-outline"
                      size={18}
                      color="gray"
                    />
                    <Text style={styles.menuText}>Notifications</Text>
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
                    style={styles.menuRow}
                    onPress={() => openURL("https://yourdomain.com/privacy")}
                  >
                    <Ionicons name="document-outline" size={18} color="gray" />
                    <Text style={styles.menuText}>Privacy Policy</Text>
                  </TouchableOpacity>

                  {/* Terms of Service */}
                  <TouchableOpacity
                    style={styles.menuRow}
                    onPress={() => openURL("https://yourdomain.com/terms")}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={18}
                      color="gray"
                    />
                    <Text style={styles.menuText}>Terms of Service</Text>
                  </TouchableOpacity>

                  {/* Feedback */}
                  <TouchableOpacity
                    style={styles.menuRow}
                    onPress={() => openURL("mailto:support@yourdomain.com")}
                  >
                    <Ionicons
                      name="chatbox-ellipses-outline"
                      size={18}
                      color="gray"
                    />
                    <Text style={styles.menuText}>Send Feedback</Text>
                  </TouchableOpacity>

                  {/* Rate App */}
                  <TouchableOpacity
                    style={styles.menuRow}
                    onPress={() =>
                      openURL(
                        "https://play.google.com/store/apps/details?id=yourapp"
                      )
                    }
                  >
                    <Ionicons name="star-outline" size={18} color="gray" />
                    <Text style={styles.menuText}>Rate this App</Text>
                  </TouchableOpacity>

                  {/* App Version */}
                  <View style={styles.menuRow}>
                    <Ionicons
                      name="information-circle-outline"
                      size={18}
                      color="gray"
                    />
                    <Text style={styles.menuText}>Version</Text>
                    <Text style={[styles.menuText, { marginLeft: "auto" }]}>
                      {/* {Constants.expoConfig?.version || "1.0.0"} */}
                      1.1.1
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          transparent
          // animationType="fade"
          visible={showLanguageModal}
          animationType="slide" //slide, fade,none
          presentationStyle="overFullScreen" //formSheet, fullScreen, overFullScreen, pageSheet
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowLanguageModal(false)}>
            <View style={styles.settingOverlayFull}>
              <TouchableWithoutFeedback>
                <View style={styles.settingsMenu}>
                  <Text style={styles.modalTitle}>Choose Language</Text>
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      setLanguage("en");
                      setShowLanguageModal(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>English</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      setLanguage("np");
                      setShowLanguageModal(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>नेपाली</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowLanguageModal(false)}
                    style={[styles.modalOption, { backgroundColor: "#555" }]}
                  >
                    <Text style={styles.modalOptionText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Footer - Created At */}
        <View className="items-center mt-10">
          <Text className="text-gray-400 dark:text-white text-xs">
            Joined: {new Date(user?.createdAt).toDateString()}
          </Text>
        </View>
      </ScrollView>
      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={closeEditModal}
        formData={formData}
        saveProfile={saveProfile}
        updateFormField={updateFormField}
        isUpdating={isUpdating}
      />
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

  settingsMenu: {
    position: "absolute",
    bottom: 150,
    right: 25,
    left: 25,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    // width: 300,
    zIndex: 20,
    elevation: 5,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#555",
  },
  menuText: { color: "black", fontSize: 14, marginLeft: 8 },

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
