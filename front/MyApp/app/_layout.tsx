import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Abre Tabs primeiro (Home, Favoritos, Perfil) */}
      <Stack.Screen name="(tabs)" />

      {/* Detalhe da notícia */}
      <Stack.Screen name="noticias/[id]" options={{ title: "Detalhe da Notícia" }} />

      {/* Login/Cadastro ainda existem, mas só são chamadas manualmente */}
      <Stack.Screen name="index" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="modal" />
    </Stack>
  );
}
