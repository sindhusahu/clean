import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { StatCard } from "@/components/StatCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useApp();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogout = () => {
    if (Platform.OS === "web") {
      logout();
      router.replace("/login");
      return;
    }
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "CC";

  const MENU_ITEMS = [
    { icon: "settings" as const, label: "Account Settings", onPress: () => {} },
    { icon: "bell" as const, label: "Notifications", onPress: () => router.push("/notifications") },
    { icon: "help-circle" as const, label: "Help & Support", onPress: () => {} },
    { icon: "info" as const, label: "About CleanCity", onPress: () => {} },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topPadding + 24, paddingBottom: bottomPadding + 100 }]}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{initials}</Text>
          </View>
          <Text style={[styles.name, { color: colors.foreground }]}>{user?.name ?? "User"}</Text>
          <Text style={[styles.email, { color: colors.mutedForeground }]}>{user?.email ?? ""}</Text>
          {user?.badge && <BadgeDisplay badge={user.badge} />}
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Reports" value={user?.reportsCount ?? 0} />
          <StatCard label="Resolved" value={user?.resolvedCount ?? 0} color="#16a34a" />
          <StatCard label="Points" value={user?.points ?? 0} color="#f59e0b" />
        </View>

        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {MENU_ITEMS.map((item, index) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.menuItem,
                {
                  borderBottomWidth: index < MENU_ITEMS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={item.onPress}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.secondary }]}>
                <Feather name={item.icon} size={16} color={colors.primary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.logoutBtn, { borderColor: colors.destructive + "40", opacity: pressed ? 0.8 : 1 }]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={16} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  name: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  email: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
