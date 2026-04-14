import { Redirect } from "expo-router";
import React from "react";
import { useApp } from "@/context/AppContext";

export default function Index() {
  const { isAuthenticated, hasSeenOnboarding } = useApp();

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
