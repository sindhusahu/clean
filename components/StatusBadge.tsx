import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { ReportStatus } from "@/context/AppContext";

interface Props {
  status: ReportStatus;
  small?: boolean;
}

const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

export function StatusBadge({ status, small }: Props) {
  const colors = useColors();

  const bgColor = {
    pending: colors.statusPending + "22",
    in_progress: colors.statusInProgress + "22",
    resolved: colors.statusResolved + "22",
    rejected: colors.statusRejected + "22",
  }[status];

  const textColor = {
    pending: colors.statusPending,
    in_progress: colors.statusInProgress,
    resolved: colors.statusResolved,
    rejected: colors.statusRejected,
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: bgColor, paddingHorizontal: small ? 8 : 10, paddingVertical: small ? 3 : 5 }]}>
      <Text style={[styles.text, { color: textColor, fontSize: small ? 10 : 12 }]}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
});
