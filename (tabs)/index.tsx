import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ReportCard } from "@/components/ReportCard";
import { StatCard } from "@/components/StatCard";
import { useApp } from "@/context/AppContext";
import type { ReportCategory } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CATEGORIES: { key: ReportCategory; label: string }[] = [
  { key: "garbage", label: "Garbage" },
  { key: "pothole", label: "Pothole" },
  { key: "drainage", label: "Drainage" },
  { key: "street_light", label: "Street Light" },
  { key: "graffiti", label: "Graffiti" },
  { key: "other", label: "Other" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, reports } = useApp();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const recentReports = useMemo(() => reports.slice(0, 5), [reports]);

  const stats = useMemo(() => ({
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    inProgress: reports.filter((r) => r.status === "in_progress").length,
  }), [reports]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPadding + 12, backgroundColor: colors.background }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            Good day, {user?.name?.split(" ")[0] ?? "Citizen"}
          </Text>
          <Text style={[styles.headline, { color: colors.foreground }]}>CleanCity</Text>
        </View>
        <Pressable
          style={[styles.notifBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push("/notifications")}
        >
          <Feather name="bell" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 }]}
      >
        <View style={styles.statsRow}>
          <StatCard label="Total Reports" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} color="#f59e0b" />
          <StatCard label="Resolved" value={stats.resolved} color="#16a34a" />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Report by Category</Text>
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.categoryChip,
                  { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => router.push({ pathname: "/submit-report", params: { category: item.key } })}
              >
                <CategoryIcon category={item.key} size={16} />
                <Text style={[styles.chipLabel, { color: colors.foreground }]}>{item.label}</Text>
              </Pressable>
            )}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.reportBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 }]}
          onPress={() => router.push("/submit-report")}
        >
          <Feather name="plus-circle" size={20} color={colors.primaryForeground} />
          <Text style={[styles.reportBtnText, { color: colors.primaryForeground }]}>Report a New Issue</Text>
        </Pressable>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Reports</Text>
            <Pressable onPress={() => router.push("/(tabs)/feed")}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
            </Pressable>
          </View>
          {recentReports.length === 0
            ? (
              <View style={[styles.emptyState, { borderColor: colors.border }]}>
                <Feather name="inbox" size={28} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No reports yet. Be the first!</Text>
              </View>
            )
            : recentReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          }
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  headline: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 20,
    paddingTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  viewAll: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  categoryList: {
    gap: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  reportBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 32,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
