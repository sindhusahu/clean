import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Report } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";
import { CategoryIcon } from "./CategoryIcon";
import { StatusBadge } from "./StatusBadge";

interface Props {
  report: Report;
  showUpvote?: boolean;
}

function timeAgo(dateString: string): string {
  const now = Date.now();
  const diff = now - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function ReportCard({ report, showUpvote = true }: Props) {
  const colors = useColors();
  const { upvoteReport } = useApp();

  const handleUpvote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    upvoteReport(report.id);
  };

  const handlePress = () => {
    router.push({ pathname: "/report/[id]", params: { id: report.id } });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.92 : 1 }]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <CategoryIcon category={report.category} size={18} />
        <View style={styles.meta}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>{report.title}</Text>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={11} color={colors.mutedForeground} />
            <Text style={[styles.location, { color: colors.mutedForeground }]} numberOfLines={1}>{report.location}</Text>
          </View>
        </View>
        <StatusBadge status={report.status} small />
      </View>

      <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
        {report.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Feather name="user" size={11} color={colors.mutedForeground} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>{report.userName}</Text>
          <Text style={[styles.dot, { color: colors.mutedForeground }]}>·</Text>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>{timeAgo(report.createdAt)}</Text>
        </View>
        {showUpvote && (
          <Pressable style={styles.upvoteBtn} onPress={handleUpvote}>
            <Feather name="arrow-up" size={13} color={colors.primary} />
            <Text style={[styles.upvoteText, { color: colors.primary }]}>{report.upvotes}</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  location: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  description: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  footerText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  dot: {
    fontSize: 11,
  },
  upvoteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: "#2d7a2d15",
  },
  upvoteText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
});
