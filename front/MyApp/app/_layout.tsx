// Arquivo: app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="noticias/[id]" options={{ title: "Detalhe da Notícia" }} />
        <Stack.Screen name="index" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="modal" />
      </Stack>

  );
}
