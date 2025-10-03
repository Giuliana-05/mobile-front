// app/(tabs)/_layout.tsx ou onde o TabsLayout está

import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function TabsLayout() {
  return (

      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#6a0dad",
          tabBarInactiveTintColor: "#999",
        }}
      >
        <Tabs.Screen
          name="noticias"
          options={{
            title: "Notícias",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favoritos"
          options={{
            title: "Favoritos",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

  );
}
