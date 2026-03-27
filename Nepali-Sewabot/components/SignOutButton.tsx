import { TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useSignOut } from "@/hooks/useSignOut";
import { useTheme } from "@/context/ThemeContext";

const SignOutButton = () => {
  const { handleSignOut } = useSignOut();
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Feather
        name="log-out"
        size={24}
        color={theme === "dark" ? "#ff6b9d" : "#E0245E"}
      />
    </TouchableOpacity>
  );
};

export default SignOutButton;
