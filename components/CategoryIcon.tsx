import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { ReportCategory } from "@/context/AppContext";

interface Props {
  category: ReportCategory;
  size?: number;
}

const ICONS: Record<ReportCategory, keyof typeof Feather.glyphMap> = {
  garbage: "trash-2",
  pothole: "alert-triangle",
  graffiti: "edit-2",
  drainage: "droplet",
  street_light: "zap",
  other: "more-horizontal",
};

const COLORS: Record<ReportCategory, string> = {
  garbage: "#16a34a",
  pothole: "#dc2626",
  graffiti: "#7c3aed",
  drainage: "#0284c7",
  street_light: "#f59e0b",
  other: "#6b7280",
};

export function CategoryIcon({ category, size = 20 }: Props) {
  const colors = useColors();
  const iconColor = COLORS[category] ?? colors.primary;
  const bgColor = iconColor + "18";

  return (
    <View style={[styles.container, { width: size * 2.2, height: size * 2.2, borderRadius: size * 1.1, backgroundColor: bgColor }]}>
      <Feather name={ICONS[category] ?? "more-horizontal"} size={size} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
