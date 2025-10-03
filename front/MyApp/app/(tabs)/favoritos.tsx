import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Title, Text, Card, Paragraph, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";

export default function Favoritos() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchFavorites() {
    setLoading(true);
    try {
      const response = await axios.get("https://back.disp/api/favorites", {
        headers: {
    Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(response.data);
    } catch (error) {
      alert("Erro ao carregar favoritos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFavorite(id) {
    try {
      await axios.delete(`https://back.disp/api/favorites/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,

        },
      });
      setFavorites((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Erro ao remover favorito");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (!favorites.length && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Title style={styles.title}>Favoritos</Title>
        <Text>Você ainda não favoritou nenhuma notícia.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Favoritos</Title>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchFavorites} />
        }
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() => router.push(`/noticias/${item.id}`)}
          >
            <Card.Content>
              <Title>{item.title}</Title>
              <Paragraph numberOfLines={2}>
                {item.description || item.content || "Sem descrição"}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="heart"
          
                onPress={() => handleRemoveFavorite(item.id)}
              />
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 10, color: "#6a0dad" },
  card: { marginBottom: 12 },
});
