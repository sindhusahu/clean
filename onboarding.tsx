import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    image: require("@/assets/images/onboarding1.png"),
    title: "Report City Issues",
    subtitle: "Spot a problem in your neighborhood? Report it instantly — garbage, potholes, broken lights & more.",
  },
  {
    id: "2",
    image: require("@/assets/images/onboarding2.png"),
    title: "Track Every Complaint",
    subtitle: "Follow the progress of your reports in real time. Know when authorities take action.",
  },
  {
    id: "3",
    image: require("@/assets/images/onboarding3.png"),
    title: "Build a Cleaner City",
    subtitle: "Earn points, badges & recognition as a city hero. Together, we make our city shine.",
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const isLast = activeIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
      router.replace("/login");
    } else {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
      setActiveIndex((i) => i + 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace("/login");
  };

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.skipRow, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={handleSkip} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <View style={[styles.textContainer, { backgroundColor: colors.background }]}>
              <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: bottomPadding + 24 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeIndex ? colors.primary : colors.border,
                  width: i === activeIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.nextBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 }]}
          onPress={handleNext}
        >
          <Text style={[styles.nextText, { color: colors.primaryForeground }]}>
            {isLast ? "Get Started" : "Next"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipRow: {
    paddingHorizontal: 24,
    alignItems: "flex-end",
  },
  skipBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  slide: {
    alignItems: "center",
  },
  image: {
    width: width,
    height: width * 0.9,
  },
  textContainer: {
    paddingHorizontal: 32,
    paddingTop: 32,
    gap: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 23,
  },
  footer: {
    paddingHorizontal: 24,
    gap: 24,
    alignItems: "center",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  nextText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});
