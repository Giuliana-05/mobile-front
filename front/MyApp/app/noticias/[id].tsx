import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { Text, Title, Paragraph, Button, Divider } from "react-native-paper";

const DEFAULT_IMAGE = require("../../assets/images/provisoria.png");

export default function NewsDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();

  let news;

  try {
    news = params.article ? JSON.parse(params.article as string) : null;
  } catch (error) {
    news = null;
  }

  if (!news) {
    return (
      <View style={styles.errorContainer}>
        <Title>Erro</Title>
        <Text>Não foi possível carregar a notícia.</Text>
        <Button mode="contained" onPress={() => router.back()} style={{ marginTop: 16 }}>
          Voltar
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Imagem da Notícia */}
      <Image
        source={news.image ? { uri: news.image } : DEFAULT_IMAGE}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Título e conteúdo */}
      <View style={styles.content}>
        <Title style={styles.title}>{news.title}</Title>

        {news.publishedAt && (
          <Text style={styles.date}>
            Publicado em {new Date(news.publishedAt).toLocaleDateString("pt-BR")}
          </Text>
        )}

        <Divider style={{ marginVertical: 10 }} />

        <Paragraph style={styles.paragraph}>
          {news.content || news.description || "Sem conteúdo disponível."}
        </Paragraph>

        <Button mode="outlined" onPress={() => router.back()} style={styles.backButton}>
          Voltar
        </Button>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f6ff",
  },
  image: {
    width: "100%",
    height: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6a0dad",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  backButton: {
    marginTop: 20,
    borderColor: "#6a0dad",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
