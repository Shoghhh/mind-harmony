import React from "react";
import { AntDesign, MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import colors from "@/styles/colors";

type IconProps = {
  color?: string;
  size?: number;
  library?: keyof typeof iconComponents;
  name: string;  
};

const staticIconSettings = {
  dashboard: { library: "MaterialIcons", name: "dashboard", size: 26 },
  todos: { library: "FontAwesome5", name: "tasks", size: 24 },
  habits: { library: "Ionicons", name: "checkmark-done", size: 26 },
  pomodoro: { library: "Ionicons", name: "timer-outline", size: 24 },
  profile: { library: "AntDesign", name: "user", size: 26 },
} as const;

const iconComponents = {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
};

const Icon = ({ name, color = colors.primary[500], size = 24, library }: IconProps) => {
  if (staticIconSettings[name as keyof typeof staticIconSettings]) {
    const { library: staticLibrary, name: staticName, size: staticSize,} = staticIconSettings[name as keyof typeof staticIconSettings];
    const IconComponent = iconComponents[staticLibrary as keyof typeof iconComponents];
    return <IconComponent name={staticName} size={staticSize} color={color}/>;
  }

  const IconComponent = iconComponents[library || "MaterialIcons"];

  if (!IconComponent) return null;

  return <IconComponent name={name} size={size} color={color} />;
};

export default Icon;
