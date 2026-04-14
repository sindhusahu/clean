import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReportCard } from "@/components/ReportCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function MyReportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, reports } = useApp();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const myReports = useMemo(
    () => reports.filter((r) => r.userId === (user?.id ?? "current-user")),
    [reports, user]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>My Reports</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {myReports.length} report{myReports.length !== 1 ? "s" : ""} submitted
        </Text>
      </View>

      <FlatList
        data={myReports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 }]}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Feather name="file-text" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No reports yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Help clean your city by reporting your first issue
            </Text>
            <Pressable
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/submit-report")}
            >
              <Text style={[styles.emptyBtnText, { color: colors.primaryForeground }]}>Report an Issue</Text>
            </Pressable>
          </View>
        )}
        renderItem={({ item }) => <ReportCard report={item} showUpvote={false} />}
        scrollEnabled={myReports.length > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 21,
  },
  emptyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
