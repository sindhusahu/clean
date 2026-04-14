import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReportCard } from "@/components/ReportCard";
import { useApp } from "@/context/AppContext";
import type { ReportStatus } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FILTERS: { key: ReportStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

export default function FeedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { reports } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ReportStatus | "all">("all");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const filtered = useMemo(() => {
    let list = reports;
    if (filter !== "all") list = list.filter((r) => r.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.upvotes - a.upvotes);
  }, [reports, search, filter]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 12, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Community Feed</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.input }]}>
          <Feather name="search" size={15} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search reports..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === f.key ? colors.primary : colors.card,
                  borderColor: filter === f.key ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterText, { color: filter === f.key ? colors.primaryForeground : colors.mutedForeground }]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 }]}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Feather name="search" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No reports found</Text>
          </View>
        )}
        renderItem={({ item }) => <ReportCard report={item} />}
        scrollEnabled={filtered.length > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1.5,
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
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
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
