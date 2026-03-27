import {
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "./ProfileScreen";

type ProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ProfileModal = ({ visible, onClose }: ProfileModalProps) => {
  const { theme } = useTheme();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "flex-end",
          }}
        >
          <TouchableWithoutFeedback>
            {/* Bottom Sheet */}
            <View
              style={{
                height: "85%",
                backgroundColor: theme === "dark" ? "black" : "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                // borderTopWidth: 1,
                borderColor: "white",
                paddingTop: 10,
                overflow: "hidden",
              }}
            >
              {/* Drag Indicator */}
              <View
                style={{
                  width: 50,
                  height: 5,
                  backgroundColor: theme === "dark" ? "#4b5563" : "#ccc",
                  borderRadius: 10,
                  alignSelf: "center",
                  marginBottom: 10,
                }}
              />

              {/* Close Button */}
              <TouchableOpacity
                onPress={onClose}
                style={{
                  position: "absolute",
                  right: 16,
                  top: 10,
                  zIndex: 10,
                }}
              >
                <Ionicons
                  name="close"
                  size={26}
                  color={theme === "dark" ? "#e5e7eb" : "black"}
                />
              </TouchableOpacity>

              {/* 👇 YOUR PROFILE SCREEN HERE */}
              <ProfileScreen />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ProfileModal;
