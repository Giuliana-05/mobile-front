import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, IconButton, Paragraph, Text, Title } from "react-native-paper";
import { authService, newsService } from '../../services/api.js';


// Imagem fallback
const DEFAULT_IMAGE = require('../../assets/images/provisoria.png');

interface NewsArticle {
    id: number;
    title: string;
    content: string;
    image?: string | null;
    publishedAt: string;
    category: string;
    description: string;
    urlToImage: string | null | undefined;
}

export default function ListaNoticias() {
    const router = useRouter();
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    // Estado para IDs das notícias favoritas
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data: any[] = await newsService.list();

                const formattedArticles: NewsArticle[] = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    image: item.image,
                    publishedAt: item.publishedAt,
                    category: item.category,
                    urlToImage: item.image,
                    description: item.content,
                }));

                setArticles(formattedArticles);

                // Aqui você pode carregar os favoritos do back, exemplo:
                // const favs = await favoriteService.list();
                // setFavorites(favs.map(f => f.newsId));

            } catch (error: any) {
                console.error("Erro ao carregar notícias:", error);
                alert(`Erro ao carregar notícias: Verifique a conexão do servidor.`);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    async function handleLogout() {
        await authService.logout();
        router.replace("/");
    }

    // Função para favoritar/desfavoritar notícia
    const toggleFavorite = async (newsId: number) => {
        try {
            if (favorites.includes(newsId)) {
                // Remove favorito
                // await favoriteService.remove(newsId);
                setFavorites(prev => prev.filter(id => id !== newsId));
            } else {
                // Adiciona favorito
                // await favoriteService.add(newsId);
                setFavorites(prev => [...prev, newsId]);
            }
        } catch (error) {
            console.error("Erro ao alterar favorito:", error);
            alert("Erro ao alterar favorito. Tente novamente.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator animating size="large" color="#6a0dad" />
                <Text style={{ marginTop: 10 }}>Carregando notícias do servidor...</Text>
            </View>
        );
    }

    const principal = articles[0];
    const outras = articles.slice(1);

    if (articles.length === 0 || !principal) {
        return (
            <View style={styles.emptyContainer}>
                <Title style={styles.title}>Últimas Notícias</Title>
                <Text style={{ marginTop: 20 }}>Nenhuma notícia encontrada no banco de dados.</Text>
                <Button mode="text" onPress={handleLogout} style={{ marginTop: 20 }} labelStyle={{ color: "#6a0dad" }}>
                    Fazer Logout
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Title style={styles.title}>Últimas Notícias</Title>
                <Button mode="text" onPress={handleLogout} labelStyle={{ color: "#6a0dad" }}>
                    Logout
                </Button>
            </View>

            {principal && (
                <Card style={styles.mainCard} onPress={() =>
                    router.push({
                        pathname: "/noticias/[id]",
                        params: { id: principal.id.toString(), article: JSON.stringify(principal) },
                    })
                }>
                    <Card.Cover
                        source={principal.urlToImage ? { uri: principal.urlToImage } : DEFAULT_IMAGE}
                    />
                    <Card.Content>
                        <Title numberOfLines={2} style={styles.mainHeadline}>{principal.title}</Title>
                        <Paragraph numberOfLines={3} style={styles.mainDesc}>{principal.description}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
                        <IconButton
                            icon={favorites.includes(principal.id) ? "heart" : "heart-outline"}
                            onPress={() => toggleFavorite(principal.id)}
                        />
                    </Card.Actions>
                </Card>
            )}

            <FlatList
                data={outras}
                keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                renderItem={({ item }) => (
                    <Card style={styles.smallCard} onPress={() =>
                        router.push({
                            pathname: "/noticias/[id]",
                            params: { id: item.id.toString(), article: JSON.stringify(item) },
                        })
                    }>
                        <View style={styles.smallCardContent}>
                            <Card.Cover
                                source={item.urlToImage ? { uri: item.urlToImage } : DEFAULT_IMAGE}
                                style={styles.smallThumb}
                            />
                            <View style={styles.smallTextContent}>
                                <Title numberOfLines={2} style={styles.smallHeadline}>{item.title}</Title>
                                <Paragraph numberOfLines={2} style={styles.smallDesc}>{item.description}</Paragraph>
                            </View>
                            <IconButton
                                icon={favorites.includes(item.id) ? "heart" : "heart-outline"}
                                onPress={() => toggleFavorite(item.id)}
                            />
                        </View>
                    </Card>
                )}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f9f6ff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#6a0dad",
    },
    mainCard: {
        marginBottom: 24,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#fff",
        elevation: 6,
    },
    mainHeadline: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 12,
        lineHeight: 30,
        color: "#6a0dad",
    },
    mainDesc: {
        fontSize: 16,
        color: "#4a4a4a",
        lineHeight: 24,
    },
    smallCard: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#fff",
        elevation: 2,
    },
    smallCardContent: {
        flexDirection: "row",
        padding: 12,
        alignItems: 'center', // pra alinhar o botão
    },
    smallThumb: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 12,
    },
    smallTextContent: {
        flex: 1,
    },
    smallHeadline: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
        lineHeight: 22,
        color: "#6a0dad",
    },
    smallDesc: {
        fontSize: 13,
        color: "#666",
        lineHeight: 18,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    emptyContainer: {
        flex: 1,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    }
});
