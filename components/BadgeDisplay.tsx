import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { User } from "@/context/AppContext";

interface Props {
  badge: User["badge"];
  size?: "sm" | "md";
}

const BADGE_CONFIG = {
  newcomer: { label: "Newcomer", icon: "star" as const, color: "#6b7280" },
  contributor: { label: "Contributor", icon: "award" as const, color: "#0284c7" },
  champion: { label: "Champion", icon: "shield" as const, color: "#7c3aed" },
  hero: { label: "City Hero", icon: "zap" as const, color: "#f59e0b" },
};

export function BadgeDisplay({ badge, size = "md" }: Props) {
  const colors = useColors();
  const cfg = BADGE_CONFIG[badge];
  const isSmall = size === "sm";

  return (
    <View style={[styles.badge, { backgroundColor: cfg.color + "18" }]}>
      <Feather name={cfg.icon} size={isSmall ? 11 : 13} color={cfg.color} />
      <Text style={[styles.label, { color: cfg.color, fontSize: isSmall ? 10 : 12 }]}>
        {cfg.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: "Inter_600SemiBold",
  },
});
