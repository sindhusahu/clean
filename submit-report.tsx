import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useApp } from "@/context/AppContext";
import type { ReportCategory } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CATEGORIES: { key: ReportCategory; label: string; description: string }[] = [
  { key: "garbage", label: "Garbage / Waste", description: "Litter, illegal dumping, overflow bins" },
  { key: "pothole", label: "Pothole / Road", description: "Damaged road, potholes, cracks" },
  { key: "drainage", label: "Drainage", description: "Blocked drain, water logging" },
  { key: "street_light", label: "Street Light", description: "Broken or missing street light" },
  { key: "graffiti", label: "Graffiti", description: "Vandalism on public property" },
  { key: "other", label: "Other", description: "Any other civic issue" },
];

export default function SubmitReportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addReport } = useApp();
  const params = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<ReportCategory | null>(
    (params.category as ReportCategory) ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!category) newErrors.category = "Please select a category";
    if (!title.trim()) newErrors.title = "Please enter a title";
    if (!description.trim() || description.length < 20) newErrors.description = "Description must be at least 20 characters";
    if (!location.trim()) newErrors.location = "Please enter the location";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    addReport({
      title: title.trim(),
      description: description.trim(),
      category: category!,
      location: location.trim(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.successIcon, { backgroundColor: colors.success + "18" }]}>
          <Feather name="check-circle" size={48} color={colors.success} />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Report Submitted!</Text>
        <Text style={[styles.successText, { color: colors.mutedForeground }]}>
          Your report has been submitted successfully. Authorities will review it shortly. You earned +10 points!
        </Text>
        <Pressable
          style={[styles.doneBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={[styles.doneBtnText, { color: colors.primaryForeground }]}>Back to Home</Text>
        </Pressable>
        <Pressable onPress={() => { setSubmitted(false); setTitle(""); setDescription(""); setLocation(""); setCategory(null); }}>
          <Text style={[styles.anotherLink, { color: colors.primary }]}>Submit Another Report</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.navBar, { paddingTop: topPadding + 8, backgroundColor: colors.background }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>Report an Issue</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPadding + 24 }]}
      >
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Category <Text style={{ color: colors.destructive }}>*</Text></Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.key}
                style={[
                  styles.categoryOption,
                  {
                    backgroundColor: category === cat.key ? colors.primary + "15" : colors.card,
                    borderColor: category === cat.key ? colors.primary : colors.border,
                    borderWidth: category === cat.key ? 2 : 1,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCategory(cat.key);
                  setErrors((e) => ({ ...e, category: "" }));
                }}
              >
                <CategoryIcon category={cat.key} size={16} />
                <Text style={[styles.catLabel, { color: colors.foreground }]}>{cat.label}</Text>
              </Pressable>
            ))}
          </View>
          {errors.category ? <Text style={[styles.fieldError, { color: colors.destructive }]}>{errors.category}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Title <Text style={{ color: colors.destructive }}>*</Text></Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: errors.title ? colors.destructive : colors.input }]}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Brief title of the issue"
              placeholderTextColor={colors.mutedForeground}
              value={title}
              onChangeText={(t) => { setTitle(t); setErrors((e) => ({ ...e, title: "" })); }}
              maxLength={80}
            />
          </View>
          {errors.title ? <Text style={[styles.fieldError, { color: colors.destructive }]}>{errors.title}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Description <Text style={{ color: colors.destructive }}>*</Text></Text>
          <View style={[styles.inputWrapper, styles.textAreaWrapper, { backgroundColor: colors.card, borderColor: errors.description ? colors.destructive : colors.input }]}>
            <TextInput
              style={[styles.input, styles.textArea, { color: colors.foreground }]}
              placeholder="Describe the issue in detail (min. 20 characters)"
              placeholderTextColor={colors.mutedForeground}
              value={description}
              onChangeText={(t) => { setDescription(t); setErrors((e) => ({ ...e, description: "" })); }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>
          <Text style={[styles.charCount, { color: colors.mutedForeground }]}>{description.length}/500</Text>
          {errors.description ? <Text style={[styles.fieldError, { color: colors.destructive }]}>{errors.description}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Location <Text style={{ color: colors.destructive }}>*</Text></Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: errors.location ? colors.destructive : colors.input }]}>
            <Feather name="map-pin" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Street name, area, landmark..."
              placeholderTextColor={colors.mutedForeground}
              value={location}
              onChangeText={(t) => { setLocation(t); setErrors((e) => ({ ...e, location: "" })); }}
            />
          </View>
          {errors.location ? <Text style={[styles.fieldError, { color: colors.destructive }]}>{errors.location}</Text> : null}
        </View>

        <View style={[styles.pointsNote, { backgroundColor: colors.success + "10", borderColor: colors.success + "30" }]}>
          <Feather name="award" size={14} color={colors.success} />
          <Text style={[styles.pointsText, { color: colors.success }]}>You'll earn +10 points for this report</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.submitBtn, { backgroundColor: colors.primary, opacity: pressed || isSubmitting ? 0.85 : 1 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? <ActivityIndicator color={colors.primaryForeground} />
            : (
              <>
                <Feather name="send" size={18} color={colors.primaryForeground} />
                <Text style={[styles.submitBtnText, { color: colors.primaryForeground }]}>Submit Report</Text>
              </>
            )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 20,
    paddingTop: 8,
  },
  section: { gap: 8 },
  label: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    width: "48%",
  },
  catLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  textAreaWrapper: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  textArea: {
    minHeight: 90,
  },
  charCount: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "right",
  },
  fieldError: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: -2,
  },
  pointsNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  pointsText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  successText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 21,
  },
  doneBtn: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  doneBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  anotherLink: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});
